import {
  AuctionListing,
  DirectListing,
  ListingType,
  Marketplace,
  NATIVE_TOKEN_ADDRESS,
  NFT,
  NFTCollection,
} from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import network from "./utils/network";

export const style = {
  borderRadius: "12px",
  fontWeight: 500,
};

export const renderErrorToast = (loadingToast: string, error: string) => {
  toast.error(error, {
    id: loadingToast,
    style: style,
  });
};

export const renderSuccessToast = (loadingToast: string, success: string) => {
  toast.success(success, {
    id: loadingToast,
    style: style,
  });
};

const customToast = (loadingToast: string, message: string, icon: string) => {
  toast(message, {
    id: loadingToast,
    style: style,
    icon: icon,
  });
};

export const mintNft = async (
  name: string | undefined,
  description: string | undefined,
  image: File | undefined,
  address: string | undefined,
  router: NextRouter,
  collectionContract: NFTCollection | undefined
) => {
  const loadingToast = toast.loading("Loading", {
    style: style,
  });

  if (!collectionContract || !address) {
    renderErrorToast(loadingToast, "Please Connect Your Wallet");
    return;
  }
  if (!image) {
    renderErrorToast(loadingToast, "Please select an image");
    return;
  }
  const metadata = {
    name: name,
    description: description,
    image: image,
  };
  try {
    const tx = await collectionContract.mintTo(address, metadata);
    const receipt = tx.receipt;
    const tokenId = tx.id;
    const nft = await tx.data();
    renderSuccessToast(loadingToast, "NFT Minted Successfully");
    router.push("/");
  } catch (error) {
    renderErrorToast(loadingToast, "Error Minting NFT");
    console.error(error);
  }
};

export const handleCreateListing = async (
  target: any,
  networkMismatch: boolean,
  createDirectListing: any,
  createAuctionListing: any,
  selectedNft: NFT,
  switchNetwork: any,
  router: NextRouter
) => {
  const loadingToast = toast.loading("Loading", {
    style: style,
  });
  if (networkMismatch) {
    customToast(loadingToast, "Switch Your Network", "⚠️");
    switchNetwork && switchNetwork(network);
    return;
  }
  if (!selectedNft) {
    renderErrorToast(loadingToast, "Please Select An NFT");
    return;
  }
  const { listingType, price } = target.elements;
  if (listingType.value === "directListing") {
    createDirectListing(
      {
        assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
        tokenId: selectedNft.metadata.id,
        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
        listingDurationInSeconds: 60 * 60 * 24 * 7, // 1 week
        quantity: 1,
        buyoutPricePerToken: price.value,
        startTimestamp: new Date(),
      },
      {
        onSuccess() {
          renderSuccessToast(loadingToast, "NFT Listed Successfully");
          router.push("/");
        },
        onError(error: any) {
          renderErrorToast(loadingToast, "Error Listing NFT");
          console.error(error);
        },
      }
    );
  }
  if (listingType.value === "auctionListing") {
    createAuctionListing(
      {
        assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT!,
        tokenId: selectedNft.metadata.id,
        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
        listingDurationInSeconds: 60 * 60 * 24 * 7,
        quantity: 1,
        buyoutPricePerToken: price.value,
        startTimestamp: new Date(),
        reservePricePerToken: 0,
      },
      {
        onSuccess() {
          renderSuccessToast(loadingToast, "NFT Listed Successfully");
          router.push("/");
        },
        onError(error: any) {
          renderErrorToast(loadingToast, "Error Listing NFT");
          console.error(error);
        },
      }
    );
  }
};

export const fetchMinimumBid = async (
  contract: Marketplace,
  listingId: string
) => {
  if (!contract || !listingId) return;
  const { displayValue, symbol } = await contract.auction.getMinimumNextBid(
    listingId
  );
  const setMinimumBid = {
    displayValue: displayValue,
    symbol: symbol,
  };
  return setMinimumBid;
};

export type MinimumBid = {
  displayValue: string;
  symbol: string;
};

export const buyNft = async (
  networkMismatch: boolean,
  switchNetwork: any,
  listing: AuctionListing | DirectListing,
  contract: Marketplace | undefined,
  listingId: string,
  buyNow: any,
  router: NextRouter
) => {
  const loadingToast = toast.loading("Loading", {
    style: style,
  });
  if (networkMismatch) {
    customToast(loadingToast, "Switch Your Network", "⚠️");
    switchNetwork && switchNetwork(network);
    return;
  }
  if (!listing || !contract || !listingId) return;
  await buyNow(
    { id: listingId, buyAmount: 1, type: listing?.type },
    {
      onSuccess() {
        renderSuccessToast(loadingToast, "Purchase Successful.");
        router.replace("/");
      },
      onError(error: any) {
        renderErrorToast(loadingToast, "Error Purchasing NFT");
        console.error(error);
      },
    }
  );
};

const bidOnAuction = async (
  makeBid: any,
  listingId: string,
  bidAmount: string,
  loadingToast: string,
  setBidAmount: Dispatch<SetStateAction<string>>
) => {
  await makeBid(
    {
      listingId: listingId,
      bid: bidAmount,
    },
    {
      onSuccess() {
        renderSuccessToast(loadingToast, "Bidding Successful.");
        setBidAmount("");
      },
      onError(error: any) {
        renderErrorToast(loadingToast, "Error Bidding on NFT");
        console.error(error);
      },
    }
  );
};

const makeOfferOnDirect = async (
  networkMismatch: boolean,
  switchNetwork: any,
  listing: AuctionListing | DirectListing,
  contract: Marketplace | undefined,
  buyNow: any,
  router: NextRouter,
  listingId: string,
  loadingToast: string,
  bidAmount: string,
  makeOffer: any,
  setBidAmount: Dispatch<SetStateAction<string>>
) => {
  if (
    listing.buyoutPrice.toString() ===
    ethers.utils.parseEther(bidAmount).toString()
  ) {
    customToast(loadingToast, "BuyOut Price Met, Buying NFT", "😍");
    buyNft(
      networkMismatch,
      switchNetwork,
      listing,
      contract,
      listingId,
      buyNow,
      router
    );
    return;
  }
  customToast(loadingToast, "BuyOut Price Not Met, Making Offer", "⚠️");
  await makeOffer(
    {
      listingId: listingId,
      quantity: 1,
      pricePerToken: bidAmount,
    },
    {
      onSuccess() {
        renderSuccessToast(loadingToast, "Offer Made Successfully.");
        setBidAmount("");
        router.replace("/");
      },
      onError(error: any) {
        renderErrorToast(loadingToast, "Error Offering on NFT");
        console.error(error);
      },
    }
  );
};

export const createBidOrOffer = async (
  networkMismatch: boolean,
  switchNetwork: any,
  listing: AuctionListing | DirectListing,
  contract: Marketplace | undefined,
  buyNow: any,
  router: NextRouter,
  listingId: string,
  makeBid: any,
  bidAmount: string,
  makeOffer: any,
  setBidAmount: Dispatch<SetStateAction<string>>
) => {
  const loadingToast = toast.loading("Loading", {
    style: style,
  });
  try {
    if (networkMismatch) {
      customToast(loadingToast, "Switch Your Network", "⚠️");
      switchNetwork && switchNetwork(network);
      return;
    }
    if (listing?.type === ListingType.Auction)
      bidOnAuction(makeBid, listingId, bidAmount, loadingToast, setBidAmount);
    if (listing?.type === ListingType.Direct)
      makeOfferOnDirect(
        networkMismatch,
        switchNetwork,
        listing,
        contract,
        buyNow,
        router,
        listingId,
        loadingToast,
        bidAmount,
        makeOffer,
        setBidAmount
      );
  } catch (error) {
    console.error(error);
  }
};
