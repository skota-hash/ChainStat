export const calculatePrice = (entry: any): number => {
  let basePrice = 0;
  let weight = 1.0; // Default weight

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
