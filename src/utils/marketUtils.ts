import { ethers } from "ethers";
import marketplaceAbi from "../../backend/artifacts/contracts/Marketplace.sol/Marketplace.json";

const MARKETPLACE_ADDRESS = import.meta.env.VITE_DEPLOYED_MARKETPLACE_ADDRESS;

export const getMarketplaceContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceAbi.abi, signer);
};
