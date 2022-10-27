import { useActiveListings, useContract } from "@thirdweb-dev/react";
import Header from "../components/Header";
import Listings from "../components/Listings";
import {ListingsLoader} from "../components/Loader"

const Home = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);
  return (
    <div className="bg-gray-100/30 min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto p-2 ">
        {loadingListings ? <ListingsLoader /> : <Listings listings={listings} />}
      </main>
    </div>
  );
};

export default Home;
