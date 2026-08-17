// Dancing With the Odds' "Road to $10K" bankroll tracker page. Update
// `lastUpdated`, `currentBankroll`, and the records below as the season
// progresses. `overall` should be the combined record across all bet
// types (not just CFB + NFL added together, since it may include other
// categories like Buckets of Ca$h).

export const bankrollTracker = {
  lastUpdated: "2026-08-17",
  currentBankroll: 0,
  goalBankroll: 10000,
  records: {
    overall: { wins: 0, losses: 0 },
    collegeFootball: { wins: 0, losses: 0 },
    nfl: { wins: 0, losses: 0 },
    bucketsOfCash: { wins: 0, losses: 0 },
  },
};
