import React, { useState, useEffect, useRef } from "react";
import { getMarketplaceContract } from "../utils/marketUtils";
import { getNFTContract } from "../utils/contractUtils";
import { ethers } from "ethers";
import gsap from "gsap";
import { toast } from "sonner";

interface ModalProps {
  tokenIds: number[];
  tokenId: number;
  imageUrl: string;
  description: string;
  onClose: () => void;
  onListed?: () => void; // for auto refresh after listed
}

const ListModal: React.FC<ModalProps> = ({
  tokenIds,
  tokenId,
  imageUrl,
  description,
  onClose,
  onListed,
}) => {
  const [price, setPrice] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  // const [selectedTokenId, setSelectedTokenId] = useState<number>(tokenIds[0]);
  // so that we always list copy instead of original
  const sortedTokenIds = [...tokenIds].sort((a, b) => b - a);
  const [selectedTokenId, setSelectedTokenId] = useState<number>(
    sortedTokenIds[0]
  );

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const handleList = async () => {
    try {
      const contract = await getMarketplaceContract();
      const nftContract = await getNFTContract();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const isApproved = await nftContract.isApprovedForAll(
        userAddress,
        contract.target
      );
      if (!isApproved) {
        const approvalTx = await nftContract.setApprovalForAll(
          contract.target,
          true
        );
        await approvalTx.wait();
        toast.success("Marketplace approved for NFT transfers ✅");
      }
      let finalPrice = price.trim();

      //no price handling
      if (!finalPrice) {
        const proceed = window.confirm(
          "⚠️ You haven't entered a price. Do you want to continue with the NFT's default price?"
        );

        if (!proceed) {
          toast.error("❗ Please enter a price before listing.");
          return;
        }

        try {
          //this if for extracting price from supplyInfo if user doesnt enter any price
          const poolId = await nftContract.tokenToPoolId(selectedTokenId);
          const supplyInfo = await nftContract.getSupplyInfo(poolId);
          console.log(supplyInfo.price);
          const extractedPrice = ethers.formatUnits(supplyInfo.price, 2);

          if (!extractedPrice || Number(extractedPrice) <= 0) {
            console.warn("❌ Invalid or missing price in metadata:", metadata);

            toast.error(
              "❗ No valid price found in metadata. Please manually enter a price."
            );

            return;
          }

          finalPrice = extractedPrice;
        } catch (err) {
          console.error("Error fetching metadata price:", err);
          toast.error(
            "❗ Error reading NFT price. Please manually enter a price."
          );
          return;
        }
      }

      const priceInUnits = ethers.parseUnits(finalPrice, 2);
      const tx = await contract.listNFT(tokenId, priceInUnits);
      await tx.wait();
      toast.success(`✅ NFT listed for ${finalPrice} YODA!`);
      if (onListed) onListed();
      onClose();
    } catch (error: any) {
      if (error.code === "ACTION_REJECTED") {
        // user rejected transaction handling
        toast.error("❗ Transaction cancelled by user.");
      } else {
        console.error("❌ Error during listing:", error);
        toast.error("❗ Something went wrong. Check console.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg text-center w-1/4 h-fit"
      >
        <img
          src={imageUrl}
          alt="NFT"
          className="w-full p-4 h-48 object-contain rounded-lg mb-4 bg-[#f9f9f9]"
        />
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="appearance-none border w-2/3 h-10 mx-4 focus:ring-0 focus:outline-none  rounded-md  text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-[#f5f5f5] p-0"
        />
        <select
          value={selectedTokenId}
          onChange={(e) => setSelectedTokenId(Number(e.target.value))}
          className="border p-2 mt-2 mb-4 rounded-md w-2/3 text-center"
        >
          {sortedTokenIds.map((id) => (
            <option key={id} value={id}>
              Token ID: {id}
            </option>
          ))}
        </select>
        <div
          className="p-6 flex
        w-fill justify-center items-center gap-2"
        >
          <button
            onClick={handleList}
            className="bg-black text-white px-4 py-2 rounded-full w-full"
          >
            Confirm Listing
          </button>
          <button
            onClick={onClose}
            className="w-1/3 rounded-full bg-[#f5f5f5] px-4 py-2 text-gray-500 w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListModal;
