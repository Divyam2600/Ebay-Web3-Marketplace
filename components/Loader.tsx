import React, { Fragment } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Fade } from "react-reveal";

export const ListingsLoader = () => {
  return (
    <Fade bottom>
      <div className="mx-auto grid gap-5 px-2 pb-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="card flex flex-col" key={i}>
            <Skeleton height={200} />
            <br />
            <Skeleton className="mb-3" />
            <hr />
            <Skeleton count={3} containerClassName="my-3" />
            <Skeleton />
            <Skeleton width={100} height={35} className="float-right mt-4" />
          </div>
        ))}
      </div>
    </Fade>
  );
};

export const OwnedNFTsLoader = () => {
  return (
    <Fade bottom>
      <div className="flex space-x-4 overflow-x-scroll px-2 py-4 scrollbar-hide">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="card flex w-full flex-col" key={i}>
            <Skeleton height={200} width={250} />
            <br />
            <Skeleton className="mb-3" />
            <hr />
            <Skeleton count={3} containerClassName="my-3" />
          </div>
        ))}
      </div>
    </Fade>
  );
};

export const ListingLoader = () => {
  return (
    <Fragment>
      <div className="grid w-full grid-cols-1 gap-4">
        <Skeleton height={300} borderRadius={"12px"} />
        <div className="w-full divide-y-2 overflow-hidden rounded-xl border-2 border-gray-300 ">
          <div className="py-3 px-5">
            <Skeleton />
          </div>
          <div className="space-y-1 py-3 px-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="grid grid-cols-2 gap-x-4" key={i}>
                <Skeleton />
                <Skeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="w-full divide-y-2 overflow-hidden rounded-xl border-2 border-gray-300 ">
          <div className="py-3 px-5">
            <Skeleton />
          </div>
          <div className="space-y-1 py-3 px-5">
            <Skeleton count={2} />
            <br />
            <Skeleton height={40} width={150} />
          </div>
          <div className="space-y-1 py-3 px-5">
            <Skeleton />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton height={40} />
              <Skeleton height={40} width={150} className="float-right" />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
