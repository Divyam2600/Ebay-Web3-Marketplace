import {
  BellIcon,
  DocumentPlusIcon,
  PhoneIcon,
  ShoppingCartIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  isOpen: boolean;
};

const SideBar = ({ isOpen }: Props) => {
  const router = useRouter();
  return (
    <div
      className={`absolute right-2 top-[55px] z-10 mt-[1px] flex w-0 flex-col items-center space-y-4 overflow-hidden bg-[#FBFBFC] py-4 text-white shadow-md duration-300 scrollbar-hide ${
        isOpen && "w-64 border px-4"
      } `}
    >
      {router.pathname !== "/" && (
        <button className="side-nav-button" onClick={() => router.push("/")}>
          <ShoppingCartIcon className="mr-2 h-6 w-6" />
          Buy NFTs
        </button>
      )}
      <button
        className="side-nav-button"
        onClick={() => router.push("/addItem")}
      >
        <DocumentPlusIcon className="mr-2 h-6 w-6" />
        Add to Inventory
      </button>
      <button
        className="side-nav-button"
        onClick={() => router.push("/create")}
      >
        <SquaresPlusIcon className="mr-2 h-6 w-6" />
        List Item
      </button>
      <button className="side-nav-button">
        <BellIcon className="mr-2 h-6 w-6" />
        Notifications
      </button>
      <button className="side-nav-button">
        <PhoneIcon className="mr-2 h-6 w-6" />
        Help & Contact
      </button>
    </div>
  );
};

export default SideBar;
