import { ethers } from "ethers";
import CustomABI from "../../backend/artifacts/contracts/Custom721.sol/Custom721.json";

export const getNFTContract = async () => {
  const CONTRACT_ADDRESS = import.meta.env.VITE_DEPLOYED_CONTRACT_ADDRESS;

  // console.log("DEBUG: Loaded CONTRACT_ADDRESS from .env ->", CONTRACT_ADDRESS);
  // console.log("DEBUG: ABI Type:", typeof CustomABI.abi); // Should be object/array

  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "undefined") {
    throw new Error(
      "❌ CONTRACT_ADDRESS is not defined. Check your .env file."
    );
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // console.log("DEBUG: Signer Address:", await signer.getAddress());

  let contract;
  try {
    contract = new ethers.Contract(CONTRACT_ADDRESS, CustomABI.abi, signer);
    // console.log("DEBUG - Contract Instantiated Successfully:", contract);
  } catch (error) {
    console.error("❌ ERROR during Contract Instantiation:", error);
  }
  // console.log("DEBUG: Contract Object:", contract); // Log full contract object
  // console.log("DEBUG: Contract Address:", contract.target); // Should be defined
  // console.log("CustomABI:", CustomABI);
  // console.log("CustomABI.abi:", CustomABI.abi); // Should be a valid array

  return contract;
};
