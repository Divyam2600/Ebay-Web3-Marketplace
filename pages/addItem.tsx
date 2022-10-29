import { useAddress, useContract } from "@thirdweb-dev/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";

type Props = {};

const addItem = (props: Props) => {
  const address = useAddress();
  const router = useRouter();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  const [preview, setPreview] = useState<string>();
  const [image, setImage] = useState<File>();
  const mintNft = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contract || !address) return;
    if (!image) {
      alert("Please select an image");
      return;
    }
    const target = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };
    const metadata = {
      name: target.name.value,
      description: target.description.value,
      image: image,
    };
    try {
      const tx = await contract.mintTo(address, metadata);
      const receipt = tx.receipt;
      const tokenId = tx.id;
      const nft = await tx.data();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="mx-auto mb-4 max-w-6xl border p-10">
      <h1 className="text-4xl font-bold">Add an Item to The MarketPlace</h1>
      <h2 className="pt-5 text-xl font-semibold">Item Details</h2>
      <p className="pb-5">
        By adding an item to the MarketPlace, you're essentially Minting an NFT
        of the item into your wallet which we can then list for sale!
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex h-80 w-80 items-center overflow-hidden rounded-md border-2">
          <Image
            alt="Preview Image"
            src={preview || "https://links.papareact.com/ucj"}
            height={320}
            width={320}
          />
        </div>
        <form
          onSubmit={mintNft}
          className="flex flex-1 flex-col space-y-2 rounded-md border-2 bg-white p-8 md:col-span-2"
        >
          <div className="group relative z-0 w-full">
            <input
              type="text"
              placeholder=" "
              id="name"
              name="name"
              className="form-input peer"
              required
            />
            <label htmlFor="floating_name" className="floating-label">
              Name of The Item
            </label>
          </div>
          <div className="group relative z-0 w-full">
            <input
              type="text"
              placeholder=" "
              id="description"
              name="description"
              className="form-input peer"
              required
            />
            <label htmlFor="floating_description" className="floating-label">
              Description
            </label>
          </div>
          <div className="space-y-2 rounded-md border-2 border-gray-300 py-2 px-4 hover:border-blue-600">
            <label
              className="block font-semibold text-gray-900 "
              htmlFor="image_input"
            >
              Upload Image of Item
            </label>
            <input
              className="block w-full cursor-pointer rounded-lg border-2 border-gray-700 bg-gray-50 text-lg font-semibold text-gray-900 focus:outline-none"
              id="image_input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  setImage(e.target.files[0]);
                }
              }}
            />
            <p className="text-sm font-semibold  text-gray-500">
              SVG, PNG, JPG, WEBP, GIF accpeted.
            </p>
          </div>
          <button
            className="mx-auto w-fit cursor-pointer rounded-md bg-blue-500 py-2 px-10 font-bold text-white"
            type="submit"
          >
            Add/Mint Item
          </button>
        </form>
      </div>
    </main>
  );
};

export default addItem;
