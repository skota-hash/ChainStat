const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const yodaTokenAddress = process.env.YODA_TOKEN_ADDRESS;
  if (!yodaTokenAddress) {
    throw new Error("YODA token address not set in .env");
  }

  const Custom721 = await hre.ethers.getContractFactory("Custom721");
  const custom721 = await Custom721.deploy(yodaTokenAddress);

  await custom721.waitForDeployment();
  const address = await custom721.getAddress();

  console.log("Custom721 deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
