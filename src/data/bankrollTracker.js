// Dancing With the Odds' "Road to $10K" bankroll tracker page. Update
// `lastUpdated`, `currentBankroll`, and the records below as the season
// progresses. `overall` should be the combined record across all bet
// types (not just CFB + NFL added together, since it may include other
// categories like Buckets of Ca$h).
//
// `weeklyBets` is the official show bet log, one entry per episode/week.
// Each bet can be:
//   { category: "College Football" | "NFL" | "Buckets of Ca$h",
//     game: "Team A @ Team B", selection: "Team A -3.5", odds: "-110",
//     note: "Optional extra context", result: "win" }
// `game`, `note`, and `result` are optional; `result` can be "win" or
// "loss" to show a checkmark/X once graded, leave it off while pending.
// These are the OFFICIAL show bets that move the bankroll and records
// above, distinct from the hosts' personal Daily Picks (pickOfTheDay.js),
// which don't affect the bankroll.

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
  weeklyBets: [],
};
