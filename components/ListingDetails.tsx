import {
  ChevronDownIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { MediaRenderer } from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { BigNumberish } from "ethers";
import React from "react";
import moment from "moment";

type Props = {
  name: string | number | undefined;
  image: string | null | undefined;
  description: string | null | undefined;
  sellerAddress: string;
  tokenId: BigNumberish;
  endTime: BigNumberish;
  startTime: BigNumberish;
  contractAddress: string;
  type: ListingType;
};

const ListingDetails = ({
  name,
  image,
  description,
  sellerAddress,
  tokenId,
  endTime,
  startTime,
  contractAddress,
  type,
}: Props) => {
  const data: { name: string; value: string }[] = [
    { name: "Name", value: name },
    { name: "Description", value: description },
    {
      name: "Seller's Address",
      value: sellerAddress.slice(0, 5) + "..." + sellerAddress.slice(-5),
    },
    {
      name: "Contract Address",
      value: contractAddress.slice(0, 15) + "...",
    },
    { name: "Listing Type", value: type === 0 ? "Direct" : "Auction" },
    {
      name: "Start Time",
      value: moment.unix(startTime).format("Do MMM, YYYY [at] hh:mm a "),
    },
    {
      name: "End Time",
      value: moment.unix(endTime).format("Do MMM, YYYY [at] hh:mm a "),
    },
  ];
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      <MediaRenderer
        src={image}
        className="my-auto w-full cursor-pointer rounded-xl shadow-md"
      />
      <div className="w-full divide-y-2 overflow-hidden rounded-xl border-2 border-gray-300">
        <div className="flex items-center gap-3 py-3 px-5 text-gray-700">
          <IdentificationIcon className="h-7 w-7" />
          <h1 className="-mt-0.5 text-xl font-semibold">Details</h1>
          <ChevronDownIcon className="animate-large ml-auto h-7 w-7 cursor-pointer" />
        </div>
        <div className="flex flex-col space-y-1 bg-blue-100/30 py-3 px-5 font-semibold text-gray-500">
          {data.map((item, i) => (
            <div className="grid grid-cols-3 xs:grid-cols-2 gap-x-4 text-sm xs:text-base whitespace-nowrap" key={i}>
              <h1>{item.name}</h1>
              <h2 className="text-right col-span-2 xs:col-span-1 text-blue-500">
                {item.value}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
