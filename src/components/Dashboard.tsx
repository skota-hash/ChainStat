import React, { useState, useEffect, useRef } from "react";
import Showcase from "./Showcase";
import MyNFTs from "./MyNFTs";
import Listed from "./Listed";
import gsap from "gsap";

const Dashboard: React.FC = () => {
  const [view, setView] = useState<"minting" | "owned" | "listed">("minting"); // 🆕 Added 'listed'
  const mintingRef = useRef<HTMLDivElement>(null);
  const ownedRef = useRef<HTMLDivElement>(null);
  const listedRef = useRef<HTMLDivElement>(null);
  const [reloadKey, setReloadKey] = useState(0); //for reload after mint
  const [listedKey, setListedKey] = useState(0); //for reload after listing

  useEffect(() => {
    if (mintingRef.current && ownedRef.current && listedRef.current) {
      const refs = {
        minting: mintingRef.current,
        owned: ownedRef.current,
        listed: listedRef.current,
      };

      Object.keys(refs).forEach((key) => {
        if (key === view) {
          gsap.fromTo(
            refs[key as keyof typeof refs],
            { opacity: 0 },
            { opacity: 1, duration: 0.3, delay: 0.3 }
          );
        } else {
          gsap.to(refs[key as keyof typeof refs], {
            opacity: 0,
            duration: 0.3,
          });
        }
      });
    }
  }, [view]);

  return (
    <div className="flex flex-col p-6">
      {/* 📋 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-700 appearance-none"></h1>
        <div className="flex gap-4">
          {/* 🖼️ Button: Minting */}
          <button
            className={`px-4 py-2 ${
              view === "minting"
                ? "text-black bg-[#f5f5f5] rounded-md text-md font-extrabold tracking-tighterneg"
                : "text-md text-[#8e8e8e] font-extrabold tracking-tighterneg"
            }`}
            onClick={() => setView("minting")}
          >
            NOW MINTING
          </button>

          {/* 👛 Button: Owned */}
          <button
            className={`px-4 py-2 ${
              view === "owned"
                ? "text-black bg-[#f5f5f5] rounded-md text-md font-extrabold tracking-tighterneg"
                : "text-md text-[#8e8e8e] font-extrabold tracking-tighterneg"
            }`}
            onClick={() => setView("owned")}
          >
            OWNED
          </button>

          <button
            className={`px-4 py-2 ${
              view === "listed"
                ? "text-black bg-[#f5f5f5] rounded-md text-md font-extrabold tracking-tighterneg"
                : "text-md text-[#8e8e8e] font-extrabold tracking-tighterneg"
            }`}
            onClick={() => setView("listed")}
          >
            LISTED
          </button>
        </div>
      </div>

      <div>
        {/* Minting */}
        <div
          ref={mintingRef}
          style={{ display: view === "minting" ? "block" : "none" }}
        >
          <Showcase onMinted={() => setReloadKey((prev) => prev + 1)} />
        </div>

        {/* Owned */}
        <div
          ref={ownedRef}
          style={{ display: view === "owned" ? "block" : "none" }}
        >
          <MyNFTs
            key={reloadKey}
            onListed={() => setListedKey((prev) => prev + 1)}
          />
        </div>

        {/* Listed */}
        <div
          ref={listedRef}
          style={{ display: view === "listed" ? "block" : "none" }}
        >
          <Listed key={listedKey} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
