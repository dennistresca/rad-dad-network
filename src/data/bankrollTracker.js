// Dancing With the Odds' "Road to $10K" bankroll tracker page. Update
// `lastUpdated`, `currentBankroll`, and the records below as the season
// progresses. `overall` is the combined College Football + NFL record
// ONLY, since Buckets of Ca$h is tracked separately (see below) and
// doesn't count toward it.
//
// `bucketsOfCash` is broken out by league instead of a single
// win/loss tally, keyed the same way as a bet's `category` (e.g. "NFL",
// "College Football"). The page adds these up itself to show the
// overall Buckets of Ca$h record, so there's only one number to
// update per league, not two. Leave a league out until it has a
// graded Buckets of Ca$h bet.
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
  lastUpdated: "2026-09-22",
  currentBankroll: 208,
  goalBankroll: 10000,
  records: {
    overall: { wins: 8, losses: 10 },
    collegeFootball: { wins: 7, losses: 5 },
    nfl: { wins: 1, losses: 5 },
    bucketsOfCash: {
      NFL: { wins: 2, losses: 3 },
      "College Football": { wins: 2, losses: 1 },
    },
  },
  weeklyBets: [
    {
      episode: "Episode 4 Bets",
      date: "2026-09-18",
      bets: [
        { category: "College Football", game: "UTEP @ Michigan", date: "2026-09-19", selection: "OVER 48.5", result: "win" },
        { category: "College Football", game: "Northern Illinois @ Arizona", date: "2026-09-19", selection: "OVER 48.5", result: "win" },
        { category: "College Football", game: "Troy @ Missouri", date: "2026-09-19", selection: "OVER 48.5", result: "loss" },
        { category: "NFL", game: "Washington Commanders vs Dallas Cowboys", date: "2026-09-20", selection: "Washington Commanders +3.5", result: "loss" },
        { category: "NFL", game: "Philadelphia Eagles vs Tennessee Titans", date: "2026-09-20", selection: "UNDER 39.5", result: "loss" },
      ],
    },
    {
      episode: "Episode 3 Bets",
      date: "2026-09-10",
      bets: [
        { category: "NFL", game: "San Francisco 49ers vs Los Angeles Rams", date: "2026-09-10", selection: "UNDER 48.5", result: "win" },
        { category: "NFL", game: "Tampa Bay Buccaneers vs Cincinnati Bengals", date: "2026-09-13", selection: "Tampa Bay Buccaneers +3.5", result: "loss" },
        { category: "College Football", game: "Bowling Green vs Nebraska", date: "2026-09-12", selection: "OVER 51.5", result: "win" },
        { category: "College Football", game: "Rice vs Notre Dame", date: "2026-09-12", selection: "OVER 54.5", result: "loss" },
        { category: "College Football", game: "Oklahoma vs Michigan", date: "2026-09-12", selection: "Oklahoma -5.5", result: "loss" },
      ],
    },
    {
      episode: "Episode 2 Bets",
      date: "2026-09-02",
      bets: [
        { category: "College Football", game: "Georgia Tech vs Colorado", date: "2026-09-03", selection: "OVER 50.5", result: "loss" },
        { category: "College Football", game: "Arizona State vs Morgan State", date: "2026-09-05", selection: "OVER 52.5", result: "win" },
        { category: "College Football", game: "Ole Miss vs Louisville", date: "2026-09-06", selection: "OVER 55.5", result: "win" },
      ],
    },
  ],
  // Extra one-off bets placed at random times, outside the weekly main
  // bets above (e.g. a spontaneous bet made mid-episode or between
  // episodes). Each entry has the same shape as a `weeklyBets` bet plus
  // its own `date` (already required). These DO count toward the bankroll
  // and records above, same as weeklyBets; update both when a side bet is
  // added or graded. A bet with no `result` yet shows under "Current Side
  // Bets" (there can be more than one active at once); once graded
  // (`result: "win"` or `"loss"`), it automatically moves to "Previous
  // Side Bets" on the page — no need to relocate entries by hand.
  sideBets: [
    { category: "College Football", game: "UTEP @ Oklahoma", date: "2026-09-04", selection: "OVER 51.5", odds: "-112", result: "loss" },
    { category: "College Football", game: "LIU @ Kansas", date: "2026-09-04", selection: "OVER 54.5", result: "win" },
    { category: "College Football", game: "Western Kentucky @ Georgia", date: "2026-09-12", selection: "OVER 54.5", result: "win" },
    { category: "NFL", game: "Denver @ Kansas City", date: "2026-09-14", selection: "Denver +2.5", odds: "-112", result: "loss" },
    { category: "NFL", game: "Detroit @ Buffalo", date: "2026-09-17", selection: "Detroit +5.5", result: "loss" },
  ],
};
