import { CameraIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { mintNft } from "../functions";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

const addItem = () => {
  const [preview, setPreview] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const address = useAddress();
  const router = useRouter();
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  const filePickerRef = useRef<any>(null);

  return (
    <div>
      <main className="mx-auto mb-4 max-w-6xl p-2">
        <h1 className="text-4xl font-bold">Add an Item to The MarketPlace</h1>
        <h2 className="pt-5 text-xl font-semibold">Item Details</h2>
        <p className="pb-5">
          By adding an item to the MarketPlace, you're essentially Minting an
          NFT of the item into your wallet which we can then list for sale!
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex h-full min-h-fit w-full items-center justify-center overflow-hidden rounded-md border-2">
            {preview ? (
              <Image
                alt="Preview Image"
                src={preview}
                height={360}
                width={360}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-8 py-24 font-semibold sm:text-lg ">
                <div
                  onClick={() => filePickerRef.current?.click()}
                  className="mx-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-red-100"
                >
                  <CameraIcon
                    className="h-8 w-8 stroke-2 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                {!preview && "Click on the Icon to Select An Image."}
              </div>
            )}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              mintNft(
                name,
                description,
                image,
                address,
                router,
                collectionContract
              );
            }}
            className="flex w-full flex-1 flex-col space-y-2 rounded-md border-2 bg-white p-4 xs:w-full xs:p-8 md:col-span-2"
          >
            <div className="group relative z-0 w-full">
              <input
                type="text"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input peer"
                required
              />
              <label className="floating-label">Name of The Item</label>
            </div>
            <div className="group relative z-0 w-full">
              <input
                type="text"
                placeholder=" "
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input peer"
                required
              />
              <label className="floating-label">Description</label>
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                    setImage(e.target.files[0]);
                  }
                }}
                ref={filePickerRef}
              />
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
    </div>
  );
};

export default addItem;
