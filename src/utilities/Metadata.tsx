import { parseStaticCSV } from "./Parser";
import { calculatePrice } from "./PriceCalculation";

export interface MintableNFT {
  id: number;
  poolId: number;
  imageUrl: string;
  price: number;
  category: string;
  date: string;
  totalSupply: number;
  description: string;
  metadata: any;
}

const getTodayFormatted = (): string => {
  const today = new Date();
  const mm = today.getMonth() + 1;
  const dd = today.getDate();
  const yy = today.getFullYear().toString().slice(-2);
  return `${mm}/${dd}/${yy}`;
};

export const generateMintableNFTs = async (): Promise<MintableNFT[]> => {
  const parsedData = await parseStaticCSV();
  const todayFormatted = getTodayFormatted();
  const todayStats = parsedData.filter(
    (entry) => entry.Date === todayFormatted
  );

  const mintableNFTs: MintableNFT[] = todayStats.map((entry, index) => {
    const price = calculatePrice(entry);
    const metadata = {
      name: `${entry.Category}`,
      description: `Top ${entry.Category} ${entry.Role} as of ${entry.Date}`,
      image: String(entry.Hash),
      attributes: [
        { trait_type: "Player", value: entry.Player },
        { trait_type: "Matches", value: entry.Matches },
        ...(entry.role === "Batsman"
          ? [
              { trait_type: "Runs", value: entry.Runs },
              { trait_type: "Fifties", value: entry.Fifties },
              { trait_type: "Centuries", value: entry.Centuries },
              { trait_type: "Strike Rate", value: entry.StrikeRate },
            ]
          : [{ trait_type: "Wickets", value: entry.Wickets }]),
      ],
      price: `${price} YODA`,
    };

    return {
      id: index + 1,
      poolId: index + 1,
      description: metadata.description,
      imageUrl: String(entry.Hash),
      price,
      category: entry.Category,
      date: entry.Date,
      totalSupply: 50,
      metadata,
    };
  });

  return mintableNFTs;
};
export const fetchLatestMetadataForPool = async (
  poolId: number
): Promise<any> => {
  const allNFTs = await generateMintableNFTs();
  const match = allNFTs.find((nft) => nft.poolId === poolId);

  if (match) {
    return match.metadata;
  } else {
    console.warn(`No metadata found in CSV for poolId ${poolId}`);
    return null;
  }
};
