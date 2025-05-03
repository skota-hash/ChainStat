import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface NFTCardProps {
  imageUrl: string;
  price: string;
  category: string;
  description: string;
  totalSupply?: number;
  onMint: (quantity: number) => void;
}

const Card: React.FC<NFTCardProps> = ({
  imageUrl,
  price,
  category,
  description,
  totalSupply = 50,
  onMint,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [remainingSupply, setRemainingSupply] = useState(Number(totalSupply));

  const numericPrice = parseFloat(price);
  const totalPrice = (numericPrice * quantity).toFixed(2);

  useEffect(() => {
    if (imgRef.current) {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [isModalOpen]);

  const handleMintClick = () => {
    setIsModalOpen(true);
  };

  const confirmMint = () => {
    onMint(quantity);
    setRemainingSupply((prev) => Math.max(prev - quantity, 0));
    setIsModalOpen(false);
    setQuantity(1);
  };

  return (
    <>
      <div className="w-auto h-auto bg-white w-64 flex flex-col items-center gap-4 rounded-xl">
        <div
          className={`w-full h-full bg-[#f9f9f9] flex items-center justify-center px-10 py-10 ${
            remainingSupply === 0 ? "opacity-50" : ""
          }`}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt={category}
            className="object-contain w-full h-full"
          />
        </div>

        <div className="flex flex-col p-2 w-full font-geist">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col w-full">
              <p className="text-sm text-[#949494]">Price</p>
              <p className="text-2xl font-semibold text-black mb-3">
                {numericPrice.toFixed(2)} YODA
              </p>
            </div>
            <span className="text-sm text-[#949494] w-full text-right">
              {category}
            </span>
          </div>

          {remainingSupply > 0 ? (
            <button
              onClick={handleMintClick}
              className="w-full bg-[#1e1e1e] text-white px-4 py-3 rounded-full hover:bg-gray-800 transition-all text-sm"
            >
              Mint NFT
            </button>
          ) : (
            <div className="w-full text-center bg-gray-300 text-gray-700 px-4 py-3 rounded-full text-sm">
              Sold Out
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-lg sm:w-1/2 md:w-1/3 flex flex-col items-center gap-4"
          >
            <div className="w-full bg-[#F9F9F9] rounded-xl p-4 flex justify-center items-center">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-60 h-60 object-contain"
              />
            </div>

            <div className="p-6 w-full flex flex-col gap-4">
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm text-gray-600">{description}</p>
                <p className="text-sm text-orange-600 font-semibold bg-orange-200 p-2 rounded-md">
                  Remaining: {remainingSupply}
                </p>
              </div>

              <div className="w-fit flex items-center gap-4 border rounded px-4 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-xl"
                >
                  -
                </button>

                <input
                  type="number"
                  min={1}
                  max={remainingSupply}
                  value={quantity}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    if (!isNaN(num)) {
                      setQuantity(Math.min(Math.max(1, num), remainingSupply));
                    }
                  }}
                  className="appearance-none outline-none focus:ring-0 focus:outline-none text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button
                  onClick={() =>
                    setQuantity(Math.min(remainingSupply, quantity + 1))
                  }
                  className="text-xl"
                >
                  +
                </button>
              </div>

              <p className="text-md text-[#898989]">
                Total:{" "}
                <span className="font-bold text-black text-3xl">
                  {totalPrice} YODA
                </span>
              </p>

              <div className="flex gap-4 mt-4 w-full justify-around">
                <button
                  onClick={confirmMint}
                  className="bg-black text-white px-4 py-2 rounded-3xl w-full hover:bg-gray-800"
                >
                  Confirm Mint
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-3xl hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
