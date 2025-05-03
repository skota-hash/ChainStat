require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

console.log("Loaded RPC:", process.env.RPC_URL);
console.log("Loaded Key:", process.env.PRIVATE_KEY ? "Found" : "Missing");

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
    },
  },
};
