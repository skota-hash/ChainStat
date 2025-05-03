import { fetchLatestMetadataForPool } from "../utilities/Metadata";

export const checkAndUpdatePoolMetadata = async (
  contract: any,
  poolId: number,
  onChainStats: any
): Promise<boolean> => {
  console.log(`📥 Fetching latest metadata for Pool ID: ${poolId}`);

  const onChainStatsObj = {
    playerName: onChainStats[0],
    matches: Number(onChainStats[1]),
    runs: Number(onChainStats[2]),
    wickets: Number(onChainStats[3]),
    fifties: Number(onChainStats[4]),
    centuries: Number(onChainStats[5]),
    strikeRate: Number(onChainStats[6]),
    category: onChainStats[7],
    role: onChainStats[8],
    image: onChainStats[9],
    date: onChainStats[10],
  };

  const offchainStats = await fetchLatestMetadataForPool(poolId);

  if (!offchainStats || Object.keys(offchainStats).length === 0) {
    console.warn(
      `⚠️ No metadata found in CSV for poolId ${poolId} — likely due to date mismatch.`
    );
    return;
  }

  if (!offchainStats) {
    console.warn(`⚠️ No offchainStats found for poolId ${poolId}`);
    return false;
  }

  const offChainStatsObj = {
    playerName: offchainStats.attributes.find(
      (a: any) => a.trait_type === "Player"
    ).value,
    matches: Number(
      offchainStats.attributes.find((a: any) => a.trait_type === "Matches")
        .value
    ),
    runs: Number(
      offchainStats.attributes.find((a: any) => a.trait_type === "Runs")
        ?.value || 0
    ),
    wickets: Number(
      offchainStats.attributes.find((a: any) => a.trait_type === "Wickets")
        ?.value || 0
    ),
    fifties: Number(
      offchainStats.attributes.find((a: any) => a.trait_type === "Fifties")
        ?.value || 0
    ),
    centuries: Number(
      offchainStats.attributes.find((a: any) => a.trait_type === "Centuries")
        ?.value || 0
    ),
    strikeRate: Number(
      offchainStats.attributes.find((a: any) => a.trait_type === "Strike Rate")
        ?.value || 0
    ),
    category: offchainStats.name,
    role: offchainStats.description.includes("Batsman") ? "Batsman" : "Bowler",
    image: offchainStats.image,
    date: offchainStats.description.match(/\d{1,2}\/\d{1,2}\/\d{2}/)?.[0] || "",
  };

  const needUpdate =
    JSON.stringify(onChainStatsObj) !== JSON.stringify(offChainStatsObj);

  if (needUpdate) {
    console.log(`🔄 Metadata mismatch detected. Updating on-chain...`);
    try {
      const tx = await contract.updatePlayerStats(poolId, [
        offChainStatsObj.playerName,
        offChainStatsObj.matches,
        offChainStatsObj.runs,
        offChainStatsObj.wickets,
        offChainStatsObj.fifties,
        offChainStatsObj.centuries,
        offChainStatsObj.strikeRate,
        offChainStatsObj.category,
        offChainStatsObj.role,
        offChainStatsObj.image,
        offChainStatsObj.date,
      ]);
      await tx.wait();
      console.log(`✅ Successfully updated Pool ${poolId} metadata on-chain.`);
      return true;
    } catch (err) {
      console.error(`❌ Failed to update Pool ${poolId}:`, err);
      return false;
    }
  } else {
    console.log(`✅ Metadata already up-to-date for Pool ${poolId}.`);
  }

  return false;
};
