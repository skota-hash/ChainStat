import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import { getNFTContract } from "../utils/contractUtils";
import { ethers } from "ethers";
import erc20AbiJson from "../utilities/ERC20.json";
import gsap from "gsap";
import { checkAndUpdatePoolMetadata } from "../utils/metadataUtils";
import { toast } from "sonner";

interface MintableNFT {
  id: number;
  imageUrl: string;
  price: number;
  category: string;
  description: string;
  totalSupply: number;
  poolId: number;
}
interface ShowcaseProps {
  onMinted?: () => void; // this is called after mint
}

const Showcase: React.FC<ShowcaseProps> = ({ onMinted }) => {
  const [mintableNFTs, setMintableNFTs] = useState<MintableNFT[]>([]);
  const [userAddress, setUserAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mintStatus, setMintStatus] = useState<string>("Processing...");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNFTs = async () => {
      const contract = await getNFTContract();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);

      const poolCount = await contract.poolIdCounter();
      const updatedNFTs: MintableNFT[] = [];

      for (let poolId = 1; poolId < Number(poolCount); poolId++) {
        try {
          const stats = await contract.getPlayerStats(poolId);

          // checking and update on-chain metadata
          await checkAndUpdatePoolMetadata(contract, poolId, stats);

          // Fetch fresh stats after update
          const [minted, max, price] = await contract.getSupplyInfo(poolId);

          updatedNFTs.push({
            id: poolId,
            imageUrl: stats.image,
            price: Number(ethers.formatUnits(price, 2)),
            category: stats.category,
            description: `Top ${stats.category} - ${stats.role} (${stats.date})`,
            totalSupply: Number(max) - Number(minted),
            poolId: poolId,
          });
        } catch (err) {
          console.error(`❌ Failed to load poolId ${poolId}:`, err);
        }
      }
      setMintableNFTs(updatedNFTs);
    };

    loadNFTs();
  }, []);

  const YODA_TOKEN_ADDRESS = import.meta.env.VITE_YODA_TOKEN_ADDRESS!;
  const YODA_ABI = erc20AbiJson.abi;

  useEffect(() => {
    if (loading && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    } else if (!loading && modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    }
  }, [loading]);

  const handleMint = async (nft: MintableNFT, quantity: number) => {
    const contract = await getNFTContract();
    const contractAddress = contract.target;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const yodaContract = new ethers.Contract(
      YODA_TOKEN_ADDRESS,
      YODA_ABI,
      signer
    );

    const totalPrice = nft.price * quantity;
    const totalPriceInUnits = ethers.parseUnits(totalPrice.toFixed(2), 2);

    const yodaBalance = await yodaContract.balanceOf(userAddress);
    if (yodaBalance < totalPriceInUnits) {
      alert("🚨 Insufficient YODA balance.");
      return;
    }

    setLoading(true);
    setMintStatus("🔄 Approving YODA tokens...");

    try {
      const approvalTx = await yodaContract.approve(
        contractAddress,
        totalPriceInUnits
      );
      await approvalTx.wait();

      setMintStatus(
        `✅ Approved ${ethers.formatUnits(totalPriceInUnits, 18)} YODA`
      );

      setMintStatus("📝 Minting your NFT...");
      const mintTx = await contract.mintFromAvailable(nft.poolId, quantity);
      await mintTx.wait();

      setMintStatus(`✅ Successfully minted ${quantity} NFTs!`);
      toast.success("✅ Minted!");
      if (onMinted) onMinted();

      setTimeout(() => setLoading(false), 2000);

      // refreshing NFTs after mint with metadata recheck
      const poolCount = await contract.poolIdCounter();
      const refreshed: MintableNFT[] = [];

      for (let poolId = 1; poolId < Number(poolCount); poolId++) {
        const stats = await contract.getPlayerStats(poolId);

        await checkAndUpdatePoolMetadata(contract, poolId, stats);

        const [minted, max, price] = await contract.getSupplyInfo(poolId);
        refreshed.push({
          id: poolId,
          imageUrl: stats.image,
          price: Number(ethers.formatUnits(price, 2)),
          category: stats.category,
          description: `Top ${stats.category} - ${stats.role} (${stats.date})`,
          totalSupply: Number(max) - Number(minted),
          poolId: poolId,
        });
      }

      setMintableNFTs(refreshed);
    } catch (err: any) {
      setMintStatus(`❌ Mint Failed: ${err.reason || err.message}`);
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {loading && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-xl shadow-lg text-center flex flex-col items-center">
            <p className="text-xl font-bold mb-2">{mintStatus}</p>
            <p className="text-gray-600">
              Please wait while we complete your minting transaction.
            </p>
          </div>
        </div>
      )}

      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 p-4">
        {mintableNFTs.map((nft) => (
          <Card
            key={nft.id}
            imageUrl={nft.imageUrl}
            price={nft.price.toString()}
            category={nft.category}
            totalSupply={nft.totalSupply}
            description={nft.description}
            onMint={(quantity) => handleMint(nft, quantity)}
          />
        ))}
      </div>
    </div>
  );
};

export default Showcase;
