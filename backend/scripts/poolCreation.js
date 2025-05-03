const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { ethers } = require("hardhat");

// 🧮 Your existing pricing logic
const calculatePrice = (entry) => {
  let basePrice = 0;
  let weight = 1.0;

  if (entry.Category === "Most Runs") {
    basePrice = Number(entry.Runs) / (Number(entry.Matches) * 15);
    weight = 1.4;
  } else if (entry.Category === "Most Wickets") {
    basePrice = (Number(entry.Wickets) * 1.5) / Number(entry.Matches);
    weight = 1.3;
  } else if (entry.Category === "Most Fifties") {
    basePrice =
      (Number(entry.Runs) / (Number(entry.Matches) * 8)) *
      (Number(entry.Fifties) / 8);
    weight = 1.4;
  } else if (entry.Category === "Highest Innings") {
    basePrice =
      Number(entry.Runs) /
      (Number(entry.Matches) * 10 +
        Number(entry.Fifties) * 8 +
        Number(entry.Centuries) * 12);
    weight = 1.2;
  } else if (entry.Category === "Best Strike Rate") {
    basePrice = Number(entry.StrikeRate) / (Number(entry.Matches) * 20);
    weight = 1.2;
  } else if (entry.Category === "Best Economy") {
    basePrice = 30 / (Number(entry.Economy) * Number(entry.Matches));
    weight = 1.1;
  }

  let weightedPrice = basePrice * weight;
  weightedPrice = Math.max(
    1,
    Math.min(Math.round(weightedPrice * 100) / 100, 10)
  );

  return weightedPrice;
};

async function main() {
  const contractAddress = process.env.DEPLOYED_CONTRACT_ADDRESS;
  const contract = await ethers.getContractAt("Custom721", contractAddress);

  const csvFilePath = path.resolve(
    __dirname,
    "../../src/data/IPL_stats_final.csv"
  );
  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      const today = new Date();
      const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}/${today
        .getFullYear()
        .toString()
        .slice(-2)}`;

      const todayStats = results.filter(
        (entry) => entry.Date === todayFormatted
      );

      for (let i = 0; i < todayStats.length; i++) {
        const entry = todayStats[i];
        const price = calculatePrice(entry);
        const priceInWei = ethers.parseUnits(price.toString(), 2);
        const maxSupply = 50; // 🆕 or whatever you want per pool

        try {
          const tx = await contract.createPool(
            {
              playerName: entry.Player,
              matches: entry.Matches,
              runs: entry.Runs,
              wickets: entry.Wickets,
              fifties: entry.Fifties,
              centuries: entry.Centuries,
              strikeRate: entry.StrikeRate,
              category: entry.Category,
              role: entry.Role,
              image: entry.Hash, // Assuming this is IPFS URL/hash
              date: entry.Date,
            },
            priceInWei,
            maxSupply
          );

          await tx.wait();
          console.log(
            `✅ Pool Created: ${entry.Category} | Player: ${entry.Player} | Price: ${price} YODA`
          );
        } catch (err) {
          console.error(
            `❌ Failed for Category: ${entry.Category} | Player: ${entry.Player}`
          );
          console.error(`Reason:`, err);
        }
      }
    });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
