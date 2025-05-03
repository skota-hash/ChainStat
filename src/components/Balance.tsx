import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import erc20AbiJson from "../utilities/Yoda.json";
import loadingSvg from "../assets/loading.svg";

//extracted yoda contarct abi for transactions
const YODA_ABI = erc20AbiJson;

const YODA_TOKEN_ADDRESS = import.meta.env.VITE_YODA_TOKEN_ADDRESS;

interface YodaBalanceProps {
  walletAddress: string;
}

const Balance: React.FC<YodaBalanceProps> = ({ walletAddress }) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    try {
      setLoading(true);

      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(YODA_TOKEN_ADDRESS, YODA_ABI, provider);

      const rawBalance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      console.log(decimals);

      const formatted = formatUnits(rawBalance, decimals);
      setBalance(formatted);
    } catch (err) {
      console.error("Error fetching YODA balance:", err);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) fetchBalance();
  }, [walletAddress]);

  return (
    <div className="bg-[#F9F9F9] w-full p-10 flex items-center justify-center gap-4 tracking-tighterneg">
      {loading ? (
        <p className="font-bold text-xl text-black">
          <img src={loadingSvg} alt="loading" /> Fetching YODA balance...
        </p>
      ) : balance !== null ? (
        <>
          <p className="font-bold text-3xl text-black-200">Balance: </p>
          <span className="font-bold text-3xl text-gray-500	">
            {balance} YODA
          </span>
        </>
      ) : (
        <p className="text-red-500">Failed to load balance</p>
      )}
    </div>
  );
};

export default Balance;
