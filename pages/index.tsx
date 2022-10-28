import { useActiveListings, useContract } from "@thirdweb-dev/react";
import Header from "../components/Header";
import Listing from "../components/Listing";
import { ListingsLoader } from "../components/Loader";

const Home = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);
  return (
    <div className="min-h-screen bg-gray-100/30">
      <Header />
      <main className="mx-auto max-w-6xl p-2 ">
        {loadingListings ? (
          <ListingsLoader />
        ) : (
          <div className="mx-auto grid gap-5 px-2 pb-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {listings?.map((listing, i) => (
              <Listing listing={listing} key={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
