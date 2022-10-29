import { useActiveListings, useContract } from "@thirdweb-dev/react";
import Head from "next/head";
import { Fragment } from "react";
import Listing from "../components/Listing";
import { Fade } from "react-reveal";
import { ListingsLoader } from "../components/Loader";
import { useRecoilState } from "recoil";
import { searchTextState } from "../atoms/searchAtom";

const Home = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);
  const [searchValue] = useRecoilState(searchTextState);
  console.log(searchValue);
  const filterListings = searchValue
    ? listings?.filter((listing) =>
        listing?.asset.name
          ?.toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
    : listings;
  return (
    <Fragment>
      <Head>
        <title>Ebay Web3 Clone</title>
      </Head>
      <div>
        <main className="mx-auto max-w-6xl p-2 ">
          {loadingListings ? (
            <ListingsLoader />
          ) : (
            <Fade bottom>
              <div className="mx-auto grid gap-5 px-2 pb-2 transition-all xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filterListings?.map((listing, i) => (
                  <Listing item={listing} key={i} />
                ))}
              </div>
            </Fade>
          )}
        </main>
      </div>
    </Fragment>
  );
};

export default Home;
