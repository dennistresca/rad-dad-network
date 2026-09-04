// Dancing With the Odds' "Road to $10K" bankroll tracker page. Update
// `lastUpdated`, `currentBankroll`, and the records below as the season
// progresses. `overall` should be the combined record across all bet
// types (not just CFB + NFL added together, since it may include other
// categories like Buckets of Ca$h).
//
// `weeklyBets` is the official show bet log, one entry per episode.
// Each bet can be:
//   { category: "College Football" | "NFL" | "Buckets of Ca$h",
//     game: "Team A @ Team B", date: "2026-09-06", selection: "Team A -3.5",
//     odds: "-110", note: "Optional extra context", result: "win" }
// `game`, `date`, `note`, and `result` are optional; `date` is the actual
// game date (not the episode's recording/publish date) and shows next to
// the matchup; `result` can be "win" or "loss" to show a checkmark/X once
// graded, leave it off while pending. These are the OFFICIAL show bets
// that move the bankroll and records above, distinct from the hosts'
// personal Daily Picks (pickOfTheDay.js), which don't affect the bankroll.

export const bankrollTracker = {
  lastUpdated: "2026-09-02",
  currentBankroll: 150,
  goalBankroll: 10000,
  records: {
    overall: { wins: 0, losses: 0 },
    collegeFootball: { wins: 0, losses: 0 },
    nfl: { wins: 0, losses: 0 },
    bucketsOfCash: { wins: 0, losses: 0 },
  },
  weeklyBets: [
    {
      episode: "Episode 2 Bets",
      date: "2026-09-02",
      bets: [
        { category: "College Football", game: "Georgia Tech vs Colorado", date: "2026-09-03", selection: "OVER 50.5" },
        { category: "College Football", game: "Arizona State vs Morgan State", date: "2026-09-05", selection: "OVER 52.5" },
        { category: "College Football", game: "Ole Miss vs Louisville", date: "2026-09-06", selection: "OVER 55.5" },
      ],
    },
  ],
  // Extra one-off bets placed at random times, outside the weekly main
  // bets above (e.g. a spontaneous bet made mid-episode or between
  // episodes). Each entry has the same shape as a `weeklyBets` bet plus
  // its own `date` (already required) — newest first. These DO count
  // toward the bankroll and records above, same as weeklyBets; update
  // both when a side bet is added or graded. The page shows only the
  // newest entry (sideBets[0]) as the "current" side bet, with the rest
  // available under "Previous Side Bets".
  sideBets: [],
};
