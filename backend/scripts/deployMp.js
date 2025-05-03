const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  if (!deployer) {
    throw new Error("Deployer signer not found");
  }

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance));

  const nftAddress = process.env.DEPLOYED_CONTRACT_ADDRESS;
  const yodaTokenAddress = process.env.YODA_TOKEN_ADDRESS;

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(nftAddress, yodaTokenAddress);
  await marketplace.waitForDeployment();

  console.log("Marketplace deployed to:", marketplace.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
