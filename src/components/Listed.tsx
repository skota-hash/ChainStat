import React, { useEffect, useState } from "react";
import { getMarketplaceContract } from "../utils/marketUtils";
import { getNFTContract } from "../utils/contractUtils";
import { ethers } from "ethers";
import { toast } from "sonner";
import userSvg from "../assets/user.svg";

interface ListedNFT {
  id: string;
  tokenId: number;
  seller: string;
  price: string;
  image: string;
  name: string;
  timestamp: number;
}

const Listed: React.FC = () => {
  const [listedNFTs, setListedNFTs] = useState<ListedNFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userAddress, setUserAddress] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);
      await fetchListings();
    };

    init();
  }, []);

  const fetchListings = async () => {
    try {
      const marketplaceContract = await getMarketplaceContract();
      const nftContract = await getNFTContract();

      const [tokenIds, listings] = await marketplaceContract.getAllListings();
      const seen = new Set<string>(); // inorder to remove duplicate listings

      const formattedListings: ListedNFT[] = [];

      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i];
        const listing = listings[i];
        const key = `${tokenId}-${listing.seller}`;

        if (listing.price === 0n || seen.has(key)) continue;
        seen.add(key);
        const tokenURI = await nftContract.tokenURI(tokenId);
        const metadata = JSON.parse(atob(tokenURI.split(",")[1]));

        formattedListings.push({
          id: key,
          tokenId: Number(tokenId),
          seller: listing.seller,
          price: ethers.formatUnits(listing.price, 2),
          image: metadata.image,
          name: metadata.name,
          timestamp: Number(listing.timestamp),
        });
      }

      setListedNFTs(formattedListings);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };
  const handleCancelListing = async (nft: ListedNFT) => {
    try {
      const marketplaceContract = await getMarketplaceContract();
      const tx = await marketplaceContract.cancelListing(nft.tokenId);
      await tx.wait();
      toast.success("Listing canceled!");
      fetchListings();
    } catch (error) {
      console.error("Error during listing:", error);
      if (error?.message?.includes("spam filter")) {
        toast.error(
          "Transaction blocked due to RPC spam filter. Please wait and try again."
        );
      } else if (error?.code === 4001) {
        toast.error("Transaction rejected by user.");
      } else {
        toast.error("Listing failed. Try again.");
      }
    }
  };

  const handleBuy = async (nft: ListedNFT) => {
    try {
      const marketplaceContract = await getMarketplaceContract();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Approving YODA token spending
      const yodaContract = new ethers.Contract(
        import.meta.env.VITE_YODA_TOKEN_ADDRESS,
        [
          "function approve(address spender, uint256 amount) public returns (bool)",
        ],
        signer
      );

      const priceInUnits = ethers.parseUnits(nft.price, 2);

      const approveTx = await yodaContract.approve(
        marketplaceContract.target,
        priceInUnits
      );
      await approveTx.wait();

      const buyTx = await marketplaceContract.buyNFT(nft.tokenId);
      await buyTx.wait();

      toast.success("NFT Purchased!");
      fetchListings(); // Refreshing after any purchase
    } catch (error) {
      toast.error("Purchase failed!");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 p-8">Loading NFTs...</p>;
  }

  if (listedNFTs.length === 0) {
    return <p className="text-center text-gray-500 p-8">No NFTs listed yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {listedNFTs.map((nft, index) => (
        <div
          key={nft.id}
          className="border rounded-lg p-4 flex flex-col justify-between"
        >
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-contain mb-2 rounded bg-[#f5f5f5] p-8"
          />
          <div className="flex flex-col gap-4 tracking-tight">
            <div className="flex justify-between items-center">
              <p className="font-bold text-orange-500 text-lg">{nft.name}</p>
              <div className="flex justify-start items-center gap-1 rounded-full bg-[#f5f5f5] px-2 py-1 w-fit">
                <img src={userSvg} alt="" />
                <p className="text-sm text-gray-500">
                  {nft.seller.slice(0, 6)}......{nft.seller.slice(-3)}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Listed on: {new Date(nft.timestamp * 1000).toLocaleDateString()}
            </p>

            <p className="text-2xl font-extrabold text-black tracking-tight">
              Price: {nft.price} YODA
            </p>
          </div>
          {nft.seller.toLowerCase() === userAddress.toLowerCase() ? (
            <button
              onClick={() => handleCancelListing(nft)}
              className="bg-red-600 text-white px-4 py-2 rounded-full mt-3"
            >
              Cancel Listing
            </button>
          ) : (
            <button
              onClick={() => handleBuy(nft)}
              className="bg-black text-white px-4 py-2 rounded-full mt-3"
            >
              Buy Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Listed;
