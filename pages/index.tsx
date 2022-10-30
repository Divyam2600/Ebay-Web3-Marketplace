import { useActiveListings, useContract } from "@thirdweb-dev/react";
import { Fragment } from "react";
import Listing from "../components/Listing";
import { Fade } from "react-reveal";
import { ListingsLoader } from "../components/Loader";
import { useRecoilState } from "recoil";
import { searchTextState } from "../atoms/searchAtom";
import toast from "react-hot-toast";
import { renderSuccessToast, style } from "../functions";

const Home = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);
  const [searchValue] = useRecoilState(searchTextState);
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
      <div>
        <main className="mx-auto mb-4 max-w-6xl p-2">
          {loadingListings ? (
            <ListingsLoader />
          ) : (
            <Fade bottom>
              <div className="mx-auto grid gap-5 px-2 pb-2 transition-all xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filterListings?.map((listing, i) => (
                  <Listing listing={listing} key={i} />
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
