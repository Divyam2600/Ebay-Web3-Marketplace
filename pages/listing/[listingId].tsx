import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ClockIcon,
  TagIcon,
  WalletIcon,
  UserCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  MediaRenderer,
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useMakeBid,
  useOffers,
  useMakeOffer,
  useBuyNow,
  useAddress,
  useAcceptDirectListingOffer,
} from "@thirdweb-dev/react";
import { ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import moment from "moment";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ListingDetails from "../../components/ListingDetails";
import {
  buyNft,
  createBidOrOffer,
  fetchMinimumBid,
  MinimumBid,
  renderErrorToast,
  renderSuccessToast,
  style,
} from "../../functions";
import network from "../../utils/network";
import CountDown from "react-countdown";
import { ListingLoader } from "../../components/Loader";

const ListingPage = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const router = useRouter();
  const { listingId } = router.query as { listingId: string };
  const { data: listing, isLoading } = useListing(contract, listingId);
  const { mutate: makeOffer } = useMakeOffer(contract);
  const { data: offers } = useOffers(contract, listingId);
  const [minimumBid, setMinimumBid] = useState<MinimumBid>();
  const { mutate: makeBid } = useMakeBid(contract);
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();
  const address = useAddress();
  const { mutate: acceptOffer } = useAcceptDirectListingOffer(contract);
  const [bidAmount, setBidAmount] = useState("");
  useEffect(() => {
    if (!listing || !contract || !listingId) return;
    if (listing.type === ListingType.Auction)
      fetchMinimumBid(contract, listingId).then((minBid) =>
        setMinimumBid(minBid)
      );
  }, [listing, contract, listingId]);

  const { mutate: buyNow } = useBuyNow(contract);
  return (
    <main className="mx-auto mb-4 grid max-w-6xl grid-cols-1 gap-5 space-y-10 p-2 pr-10 lg:grid-cols-2 lg:space-y-0">
      {isLoading ? (
        <ListingLoader />
      ) : !listing ? (
        "Not Found"
      ) : (
        <Fragment>
          <ListingDetails
            name={listing.asset.name}
            image={listing.asset.image}
            description={listing.asset.description}
            sellerAddress={listing.sellerAddress}
            tokenId={listing.tokenId}
            endTime={
              listing.type === ListingType.Direct
                ? listing.secondsUntilEnd
                : listing.endTimeInEpochSeconds
            }
            startTime={
              listing.type === ListingType.Direct
                ? listing.startTimeInSeconds
                : listing.startTimeInEpochSeconds
            }
            contractAddress={listing.assetContractAddress}
            type={listing.type}
          />
          <section className="space-y-4 pb-20 lg:pb-0">
            <div className="w-full divide-y-2 overflow-hidden rounded-xl border-2 border-gray-300">
              <div className="whitespace- flex items-center justify-between space-x-2 py-3 px-3 text-gray-700">
                <ClockIcon className="h-4 w-4 xs:h-7 xs:w-7" />
                <h1 className="-mt-0.5 text-[15px] font-semibold xs:text-lg sm:text-xl">
                  Sale Ends&nbsp;
                  {moment
                    .unix(
                      listing.type === ListingType.Direct
                        ? listing.secondsUntilEnd
                        : listing.endTimeInEpochSeconds
                    )
                    .format("Do MMM, YYYY [at] hh:mm a ")}{" "}
                </h1>
                <ChevronDownIcon className="animate-large hidden h-7 w-7 cursor-pointer xs:inline" />
              </div>
              <div className="flex flex-col space-y-1 bg-blue-100/30 py-3 px-5 font-semibold text-gray-500">
                <h1 className="font-normal">Buy Now Price</h1>
                <h2 className="text-2xl font-semibold">
                  {listing.buyoutCurrencyValuePerToken.displayValue}&nbsp;
                  {listing.buyoutCurrencyValuePerToken.symbol}
                </h2>
                <br />
                <button
                  className="primary-button rounded-lg hover:scale-x-[1.04]"
                  onClick={() =>
                    buyNft(
                      networkMismatch,
                      switchNetwork,
                      listing,
                      contract,
                      listingId,
                      buyNow,
                      router
                    )
                  }
                >
                  Buy Now
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 bg-blue-100/30 py-3 px-5 text-gray-500 xs:grid-cols-2">
                <h1 className="col-span-3 text-xl font-semibold underline sm:text-2xl">
                  {listing.type === ListingType.Direct
                    ? "Make an Offer"
                    : "Bid on this Auction"}
                </h1>
                {listing.type === ListingType.Auction && (
                  <p className="col-span-3 grid grid-cols-2 text-lg font-semibold sm:text-xl">
                    <h1>Minimum Bid:</h1>
                    <h2 className="text-right">
                      {minimumBid?.displayValue} {minimumBid?.symbol}
                    </h2>
                    <h1>Time Remaining:</h1>
                    <h2 className="text-right">
                      <CountDown
                        renderer={({ hours, minutes, seconds, days }) => (
                          <span>
                            {days * 24 + hours}:{minutes}:{seconds}
                          </span>
                        )}
                        date={
                          Number(listing.endTimeInEpochSeconds.toString()) *
                          1000
                        }
                      />
                    </h2>
                  </p>
                )}
                <div className="group relative z-0 col-span-3 w-full xs:col-span-2">
                  <input
                    type="text"
                    placeholder=" "
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="form-input peer"
                    required
                  />
                  <label className="floating-label bg-[#F1F6FD]">
                    {listing.type === ListingType.Direct
                      ? "Enter Offer Amount"
                      : minimumBid
                      ? Number(minimumBid.displayValue) >= 0 &&
                        `${minimumBid.displayValue} ${minimumBid.symbol} or more`
                      : "Enter Bid Amount"}
                  </label>
                </div>
                <button
                  className="side-nav-button col-span-full mx-auto max-w-full whitespace-nowrap rounded-lg xs:col-span-1 xs:mx-0"
                  onClick={() =>
                    createBidOrOffer(
                      networkMismatch,
                      switchNetwork,
                      listing,
                      contract,
                      buyNow,
                      router,
                      listingId,
                      makeBid,
                      bidAmount,
                      makeOffer,
                      setBidAmount
                    )
                  }
                >
                  {listing.type === ListingType.Direct ? (
                    <TagIcon className="mr-2 h-6 w-6 stroke-2" />
                  ) : (
                    <WalletIcon className="mr-2 h-6 w-6" />
                  )}
                  {listing.type === ListingType.Direct
                    ? "Make Offer"
                    : "Place Bid"}
                </button>
              </div>
            </div>
            {listing.type === ListingType.Direct && offers && (
              <div className="w-full divide-y-2 overflow-hidden rounded-xl border-2 border-gray-300">
                <div className="flex items-center gap-3 py-3 px-5 text-gray-700">
                  <AdjustmentsHorizontalIcon className="h-7 w-7" />
                  <h1 className="-mt-0.5 text-xl font-semibold">Offers</h1>
                  <ChevronDownIcon className="animate-large ml-auto h-7 w-7 cursor-pointer" />
                </div>
                {offers.length > 0 && (
                  <div className="flex flex-col divide-y-2 bg-blue-100/30 px-5 font-semibold text-gray-500">
                    {offers.map((offer, i) => (
                      <div
                        className="flex w-full items-center justify-between space-x-2 py-2 px-3 text-lg"
                        key={i}
                      >
                        <h1 className="hidden items-center gap-2  sm:inline-flex">
                          <UserCircleIcon className="h-6 w-6" />
                          {offer.offeror.slice(0, 5) +
                            "..." +
                            offer.offeror.slice(-5)}
                        </h1>
                        <h2>
                          {ethers.utils.formatEther(offer.totalOfferAmount)}
                          &nbsp;
                          {NATIVE_TOKENS[network].symbol}
                        </h2>
                        {listing.sellerAddress === address && (
                          <button
                            className="side-nav-button max-w-fit gap-2 shadow-none"
                            onClick={(e) => {
                              e.preventDefault();
                              const loadingToast = toast.loading("Loading", {
                                style: style,
                              });
                              acceptOffer(
                                {
                                  listingId,
                                  addressOfOfferor: offer.offeror,
                                },
                                {
                                  onSuccess() {
                                    renderSuccessToast(
                                      loadingToast,
                                      "Offered Accepted Successfully"
                                    );
                                  },
                                  onError(error) {
                                    renderErrorToast(
                                      loadingToast,
                                      "Error Accepting Offer"
                                    );
                                    console.error(error);
                                  },
                                }
                              );
                            }}
                          >
                            <PlusIcon className="h-5 w-5" /> Accept Offer
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </Fragment>
      )}
    </main>
  );
};

export default ListingPage;
