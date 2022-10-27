import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ListingsLoader = () => {
  return (
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
  );
};
