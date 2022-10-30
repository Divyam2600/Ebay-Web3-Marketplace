import React, { useState } from "react";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import { AuctionListing, DirectListing, ListingType } from "@thirdweb-dev/sdk";
import { MediaRenderer } from "@thirdweb-dev/react";
import { StarIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import { useRouter } from "next/router";

const MAX_RATING = 5;
const MIN_RATING = 1;

type Props = {
  listing: AuctionListing | DirectListing;
};
const Listing = ({ listing }: Props) => {
  const [rating] = useState(
    Math.floor(Math.random() * (MAX_RATING - MIN_RATING + 1)) + MIN_RATING
  );

  const router = useRouter();

  return (
    <div
      className="card flex flex-col"
      onClick={() => router.push(`/listing/${listing.id}`)}
    >
      <div className="flex h-52 flex-1 flex-col items-center object-cover pb-2">
        <MediaRenderer
          className="aspect-auto w-full rounded-md"
          src={listing.asset.image}
        />
      </div>
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <h2 className="truncate text-lg font-semibold text-gray-800">
            {listing.asset.name}
          </h2>
          <hr className="border-gray-300" />
          <p className="text-sm text-gray-600 line-clamp-3">
            {listing.asset.description}
          </p>
          <div className="flex">
            {Array.from({ length: rating }).map((_, i) => (
              <StarIcon className="h-5 text-yellow-500" key={i} />
            ))}
          </div>
          <div className="space-y-1 rounded-lg border bg-[#FBFBFC] p-2">
            <p className="text-sm font-semibold text-gray-600 line-clamp-3">
              <span className="mr-1 text-blue-500">Hosted On :</span>
              {moment
                .unix(
                  listing.type === ListingType.Direct
                    ? listing.startTimeInSeconds
                    : listing.startTimeInEpochSeconds
                )
                .format("Do MMM, YYYY")}
            </p>
            <p className="text-sm font-semibold text-gray-600 line-clamp-3">
              <span className="mr-1 text-blue-500">Hosted By :</span>
              {listing.sellerAddress.slice(0, 5) +
                "..." +
                listing.sellerAddress.slice(-4)}
            </p>
          </div>
        </div>
        <p className="flex gap-1">
          <span className="font-bold">
            {listing.buyoutCurrencyValuePerToken.displayValue}
          </span>
          {listing.buyoutCurrencyValuePerToken.symbol}
        </p>
        <button
          className={`animate-small ml-auto flex w-fit items-center justify-end gap-2 rounded-md border py-2 px-3 font-semibold text-white ${
            listing.type === ListingType.Direct ? "bg-blue-500" : "bg-red-500"
          }`}
        >
          {listing.type === ListingType.Direct ? "Buy Now" : "Auction"}
          {listing.type === ListingType.Direct ? (
            <BanknotesIcon className="h-6 w-6" />
          ) : (
            <ClockIcon className="h-6 w-6 stroke-2" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Listing;
