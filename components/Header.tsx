import React from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
import {
  BellIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

type Props = {};

const Header = (props: Props) => {
  const connectWithMetaMask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  const bottomBar = [
    "Home",
    "Electronics",
    "Computer",
    "Video Games",
    "Home & Garden",
    "Healthy & Beauty",
    "Collectibles and Art",
    "Books",
    "Musics",
    "Deals",
    "Other",
    "More",
  ];

  return (
    <div className="mx-auto max-w-6xl p-2">
      {/* Top Navbar */}

      <nav className="flex justify-between">
        <div className="flex items-center space-x-2 text-sm">
          {address ? (
            <button onClick={disconnect} className="connect-wallet-button">
              Hi, {address.slice(0, 5) + "..." + address.slice(-4)}
            </button>
          ) : (
            <button
              onClick={connectWithMetaMask}
              className="connect-wallet-button"
            >
              Connect Your Wallet
            </button>
          )}
          <p className="header-link">Daily Deals</p>
          <p className="header-link">Help & Contact</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <p className="header-link">Ship to</p>
          <p className="header-link">Sell</p>
          <p className="link header-link gap-1 sm:inline-flex">
            WatchList
            <ChevronDownIcon className="h-4 w-4 stroke-2" />
          </p>
          <Link href="/addItem" className="link header-link inline-flex gap-1">
            Add to Inventory
            <ChevronDownIcon className="h-4 w-4 stroke-2" />
          </Link>
          <BellIcon className="animate-large h-6 w-6 cursor-pointer" />
          <ShoppingCartIcon className="animate-large h-6 w-6 cursor-pointer" />
        </div>
      </nav>

      <hr className="mt-2" />

      {/* Middle Navbar */}

      <section className="flex items-center space-x-2 py-5 ">
        <div className="h-16 w-16 flex-shrink-0 cursor-pointer sm:w-28 md:w-44">
          <Link href="/">
            <Image
              className="h-full w-full object-contain"
              alt="ThirdWeb Logo"
              src={"https://links.papareact.com/bdb"}
              width={100}
              height={100}
              priority
            />
          </Link>
        </div>
        <div className="hidden cursor-pointer w-20 items-center hover:underline lg:flex">
          <p className="text-sm text-gray-600">Shop by Category</p>
          <ChevronDownIcon className="h-4 w-4 flex-shrink-0 stroke-2" />
        </div>
        <div className="flex flex-1 items-center space-x-2 border-2 border-black px-2 py-2 md:px-5 rounded-[2px]">
          <MagnifyingGlassIcon className="w-5 stroke-gray-400 stroke-2" />
          <input
            type="text"
            placeholder="Search for Anything..."
            className="flex-1 w-24 bg-inherit outline-none placeholder:font-semibold"
          />
        </div>
        <button className=" cursor- rounded-[2px] border-2 border-blue-600 bg-blue-600 px-5 py-2 font-semibold text-white md:px-10">
          Search
        </button>
        <Link href="/create">
          <button className="hidden rounded-[2px] cursor-pointer border-2 border-blue-600 px-5 py-2 font-semibold hover:bg-blue-600/60 hover:text-white sm:inline md:px-10">
            List Item
          </button>
        </Link>
      </section>

      <hr />

      {/* Bottom Nav Bar */}

      <section className="flex space-x-6 overflow-x-scroll whitespace-nowrap p-3 text-sm scrollbar-hide">
        {bottomBar.map((item) => (
          <p className="link" key={item}>{item}</p>
        ))}
      </section>
    </div>
  );
};

export default Header;
