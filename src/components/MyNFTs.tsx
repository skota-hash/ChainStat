import React, { useEffect, useState } from "react";
import { getNFTContract } from "../utils/contractUtils";
import { ethers } from "ethers";
import ListModal from "./ListModal";
import { checkAndUpdatePoolMetadata } from "../utils/metadataUtils";
import { getMarketplaceContract } from "../utils/marketUtils";

interface OwnedNFT {
  name: string;
  description: string;
  image: string;
  count: number;
  tokenIds: number[];
}
//for refresh after listing nft
interface NFTProps {
  onListed: () => void;
}
const MyNFTs: React.FC<NFTProps> = ({ onListed }) => {
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [userAddress, setUserAddress] = useState<string>("");
  const [selectedNFT, setSelectedNFT] = useState<OwnedNFT | null>(null);
  const [showListModal, setShowListModal] = useState(false);

  const loadUserNFTs = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setUserAddress(address);

    const contract = await getNFTContract();
    const balance = await contract.balanceOf(address);

    const poolChecked: Set<number> = new Set();
    const nftMap: { [key: string]: OwnedNFT } = {};
    const userTokenIds: number[] = []; // to store lsted tokenIDs

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      userTokenIds.push(Number(tokenId));

      const poolId = await contract.tokenToPoolId(tokenId);
      const onChainStats = await contract.getPlayerStats(poolId);

      if (!poolChecked.has(poolId)) {
        await checkAndUpdatePoolMetadata(contract, poolId, onChainStats);
        poolChecked.add(poolId);
      }

      const tokenURI = await contract.tokenURI(tokenId);
      const base64String = tokenURI.split(",")[1];
      const jsonString = atob(base64String);
      const metadata = JSON.parse(jsonString);

      const key = metadata.name + metadata.image;

      if (!nftMap[key]) {
        nftMap[key] = {
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          count: 1,
          tokenIds: [Number(tokenId)],
        };
      } else {
        nftMap[key].count += 1;
        nftMap[key].tokenIds.push(Number(tokenId));
      }
    }

    //fetching listed tokenIDs
    const listedSet = await fetchListedTokenIds(userTokenIds);
    // listed count
    const finalNFTs = Object.values(nftMap).map((nft) => {
      const listedCount = nft.tokenIds.filter((id) => listedSet.has(id)).length;
      return { ...nft, listedCount };
    });

    setOwnedNFTs(finalNFTs);
  };

  const fetchListedTokenIds = async (tokenIds: number[]) => {
    const marketplaceContract = await getMarketplaceContract();
    const [marketTokenIds, listings] =
      await marketplaceContract.getAllListings();

    const listedSet = new Set<number>();

    for (let i = 0; i < marketTokenIds.length; i++) {
      const listing = listings[i];
      if (listing.price > 0n) {
        listedSet.add(Number(marketTokenIds[i]));
      }
    }

    return listedSet;
  };

  useEffect(() => {
    loadUserNFTs();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {ownedNFTs.length === 0 ? (
        <p className="text-gray-500 flex justify-center">No NFTs owned yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
          {ownedNFTs.map((nft, idx) => (
            <div
              key={idx}
              className=" rounded-lg flex flex-col justify-between"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className=" mb-2 w-full h-full object-contain bg-[#f5f5f5] p-8"
              />
              <div className="p-4">
                <p className="font-bold text-xl">{nft.name}</p>
                <p className="text-gray-400 text-sm">{nft.description}</p>
                <div className="flex gap-2">
                  <p className="mt-2 text-sm text-orange-500">
                    You own: <span className="font-semibold">{nft.count}</span>{" "}
                  </p>
                  <p className="mt-2 text-sm text-orange-500">
                    Listed:{" "}
                    <span className=" font-semibold">
                      {(nft as any).listedCount}
                    </span>
                  </p>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    setSelectedNFT(nft);
                    setShowListModal(true);
                  }}
                  className="bg-black text-white w-full px-4 py-2 rounded-full mt-2"
                >
                  List NFT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showListModal && selectedNFT && (
        <ListModal
          tokenIds={selectedNFT.tokenIds}
          tokenId={selectedNFT.tokenIds[0]}
          imageUrl={selectedNFT.image}
          description={selectedNFT.description}
          onClose={async () => {
            setShowListModal(false);
            await loadUserNFTs();
          }}
          onListed={onListed}
        />
      )}
    </div>
  );
};

export default MyNFTs;
