import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import srhLogo from "../assets/srh.png";
import rcbLogo from "../assets/rcb.png";
import kkrLogo from "../assets/kkr.png";
import cskLogo from "../assets/csk.png";
import miLogo from "../assets/mi.png";
import pskLogo from "../assets/psk.png";
import gtLogo from "../assets/gt.png";

interface NavbarProps {
  walletAddress: string;
  onDisconnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  walletAddress,
  onDisconnect,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const levels = [80, 160, 130, 180, 90, 160, 100];
    // const levels = [160, 140, 120, 100, 80, 60, 40];

    const ctx = gsap.context(() => {
      gsap.utils
        .toArray<HTMLImageElement>(".team-logo")
        .forEach((el, index) => {
          gsap.fromTo(
            el,
            { y: 300, opacity: 0 },
            {
              y: levels[index],
              opacity: 1,
              duration: 1,
              delay: index * 0.2,
              ease: "power3.out",
            }
          );
        });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav className="w-full h-fit bg-white py-3 px-6 flex items-center justify-between shadow-sm">
      {walletAddress && (
        <div className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col items-start gap-8 p-10">
            <p className="text-8xl font-extrabold tracking-tighter text-brand">
              ChainStat.
            </p>
            <p className="text-[#8e8e8e] text-sm max-w-md leading-relaxed">
              Experience the thrill of cricket like never before. Our
              decentralized marketplace lets you collect, trade, and own dynamic
              NFTs tied to live IPL player stats. As matches unfold, NFT
              metadata updates automatically to reflect real-time performance.
            </p>
            <div className="flex flex-row gap-10 items-center">
              <p className="text-sm text-gray-700 font-medium whitespace-nowrap">
                Connected:{" "}
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {walletAddress}
                </span>
              </p>

              {/* Disconnect Button*/}
              <button
                onClick={onDisconnect}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
              >
                Disconnect
              </button>
            </div>
          </div>
          {/* logo animation */}
          <div
            ref={containerRef}
            className="sm:flex-row md:flex overflow-hidden flex-row h-90 justify-center items-end gap-2 w-full relative"
          >
            <img
              src={srhLogo}
              alt="SRH"
              className="team-logo w-fit h-fit object-contain"
            />
            <img
              src={cskLogo}
              alt="CSK"
              className="team-logo w-fit h-fit object-contain"
            />
            <img
              src={miLogo}
              alt="MI"
              className="team-logo w-fit h-fit object-contain"
            />
            <img
              src={kkrLogo}
              alt="KKR"
              className="team-logo w-fit h-fit object-contain"
            />
            <img
              src={rcbLogo}
              alt="RCB"
              className="team-logo w-fit h-fit object-contain"
            />
            <img
              src={pskLogo}
              alt="RCB"
              className="team-logo w-fit h-fit object-contain"
            />
            <img
              src={gtLogo}
              alt="RCB"
              className="team-logo w-fit h-fit object-contain"
            />
          </div>
        </div>
      )}
    </nav>
  );
};
