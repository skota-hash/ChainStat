import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import symbol from "../assets/symbol.png";
import bgshape from "../assets/bg-shape.png";
import svg from "../assets/svg.svg";

interface WalletConnectProps {
  onConnected: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnected }) => {
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const connectWallet = async () => {
    try {
      setConnecting(true);
      if (!window.ethereum) {
        setError("🦊 Please install MetaMask.");
        setConnecting(false);
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        onConnected(accounts[0]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-[#898989]/20 font-geist">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full flex flex-col gap-y-6 relative"
      >
        <div className="flex flex-col gap-y-4 items-start">
          <div className="flex flex-row justify-between items-center w-full">
            <p className="text-5xl tracking-tighterneg text-brand font-extrabold">
              ChainStat
            </p>
            <img src={svg} alt="emoji" className="w-[20px] h-[20px]" />
          </div>

          <p className="text-sm text-[#949494] mt-2 text-left">
            Own the Game. Mint Live IPL 2025 Stats as NFTs.
            <br />
            Powered by YODA.
          </p>
        </div>

        <div className="bg-[#F0F0F0] rounded-xl px-6 py-8 flex flex-col items-center gap-2 relative overflow-hidden">
          <img
            src={bgshape}
            alt="Decoration"
            className=" w-full h-48 object-contain absolute -z-8 opacity-10"
          />

          <button
            onClick={connectWallet}
            disabled={connecting}
            className="relative"
          >
            <img src={symbol} alt="Metamask" className="w-30 h-30 " />
          </button>

          <p className="text-sm text-[#9F9F9F] mb-2">
            {connecting
              ? "🔄 Connecting to MetaMask..."
              : "Connect your MetaMask Wallet"}
          </p>

          {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
