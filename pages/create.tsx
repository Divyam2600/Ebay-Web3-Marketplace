import {
  useAddress,
  useContract,
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Fade } from "react-reveal";
import { OwnedNFTsLoader } from "../components/Loader";
import { handleCreateListing } from "../functions";

const create = () => {
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  const [selectedNft, setSelectedNft] = useState<NFT>();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const { mutate: createDirectListing } = useCreateDirectListing(contract);
  const { mutate: createAuctionListing } = useCreateAuctionListing(contract);
  const router = useRouter();
  const { data: ownedNFTs, isLoading: loadingNfts } = useOwnedNFTs(
    collectionContract,
    address
  );
  let target;
  return (
    <main className="mx-auto mb-4 max-w-6xl p-2">
      <h1 className="special-text">List an Item</h1>
      <h2 className="pt-5 text-xl font-semibold">
        Select An Item You Would Like To Sell
      </h2>
      <hr className="mb-5" />
      <p>Below you will find the NFTs you own in the wallet</p>
      {loadingNfts ? (
        <OwnedNFTsLoader />
      ) : (
        <Fade bottom>
          <div className="flex space-x-4 overflow-x-scroll py-4 px-2 scrollbar-hide">
            {ownedNFTs?.map((nft) => (
              <div
                key={nft.metadata.id}
                className={`card flex min-w-fit flex-col space-y-2 border-2 bg-gray-100 ${
                  nft.metadata.id === selectedNft?.metadata.id
                    ? "scale-105 border-black"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedNft(nft)}
              >
                <div className="flex h-52 flex-1 flex-col items-center object-cover pb-2">
                  <MediaRenderer
                    src={nft.metadata.image}
                    className="h-40 rounded-md "
                  />
                </div>
                <p className="truncate text-lg font-bold">
                  {nft.metadata.name}
                </p>
                <p className="truncate text-xs line-clamp-3">
                  {nft.metadata.description}
                </p>
              </div>
            ))}
          </div>
        </Fade>
      )}
      {selectedNft && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            target = e.target as typeof e.target & {
              elements: {
                listingType: { value: string };
                price: { value: string };
              };
            };
            handleCreateListing(
              target,
              networkMismatch,
              createDirectListing,
              createAuctionListing,
              selectedNft,
              switchNetwork,
              router
            );
          }}
          className="flex flex-col space-y-2 rounded-lg border-2 border-gray-300 bg-gray-100 p-6 "
        >
          <div className="flex flex-col space-y-4 ">
            <div className="flex w-full cursor-pointer items-center rounded-md border-2 border-gray-200 bg-[#FBFBFC] py-2 px-4 font-semibold">
              <label>Direct Listing</label>
              <input
                type="radio"
                required
                name="listingType"
                value="directListing"
                className="ml-auto h-4 w-4"
              />
            </div>
            <div className="flex w-full cursor-pointer items-center rounded-md border-2 border-gray-200 bg-[#FBFBFC] py-2 px-4 font-semibold">
              <label>Auction Listing</label>
              <input
                type="radio"
                required
                name="listingType"
                value="acuctionListing"
                className="ml-auto h-4 w-4"
              />
            </div>
            <div className="flex w-full items-center rounded-md border-2 border-gray-200 bg-[#FBFBFC] py-2 px-4 font-semibold">
              <label>Price</label>
              <input
                type="text"
                name="price"
                className="ml-auto -mr-2 rounded-md border-2 border-gray-200 bg-gray-100 py-2 px-3 font-normal placeholder:font-semibold xs:px-5"
                placeholder="0.0005 MATIC"
              />
            </div>
          </div>
          <br />
          <button
            className="mx-auto w-fit cursor-pointer rounded-md bg-blue-500 py-2 px-10 font-bold text-white"
            type="submit"
          >
            Create Listing
          </button>
        </form>
      )}
    </main>
  );
};

export default create;
