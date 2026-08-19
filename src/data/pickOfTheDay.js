// Dancing With the Odds' "Pick of the Day" page. Update `date` to today
// whenever you refresh the picks below, then add each host's pick(s) to
// their array. Each pick can be:
//   { league: "MLB", game: "Team A @ Team B", selection: "Team A -3.5", odds: "-110", note: "Optional extra context", result: "win" }
// `league` should always be set (e.g. "MLB", "NFL", "NCAAF") so readers
// can't mistake a matchup for the wrong sport, since some team city names
// overlap across leagues (e.g. Baltimore/Tampa Bay could read as MLB or
// NFL). `note` and `result` are optional. `result` can be "win" or "loss"
// to show a checkmark/X once a pick is graded; leave it off while still
// pending. Leave a host's array as [] if they haven't submitted a pick
// yet, the page will show a "no pick yet" placeholder for them.
//
// `records` tracks each host's Daily Picks win-loss record BROKEN OUT BY
// LEAGUE, keyed the same way as each pick's `league` (e.g. "MLB", "NFL",
// "NCAAF"). Update the matching league's wins/losses as picks are graded.
// The page adds these up itself to show each host's overall record, so
// there's only one number to update, not two. Leave a league out of a
// host's record entirely until they have a graded pick in it.

export const pickOfTheDay = {
  date: "2026-08-18",
  picks: {
    Dennis: [
      { league: "MLB", game: "St Louis vs Cincinnati", selection: "St Louis ML", result: "win" },
      { league: "MLB", game: "Detroit vs Pittsburgh", selection: "Detroit ML", result: "loss" },
      { league: "MLB", game: "Kansas City vs Athletics", selection: "Kansas City ML", result: "win" },
    ],
    Shaun: [
      { league: "MLB", game: "Seattle @ Milwaukee", selection: "NRFI", result: "loss" },
      { league: "MLB", game: "Arizona @ Boston", selection: "YRFI", result: "win" },
      { league: "MLB", game: "Miami @ Philadelphia", selection: "YRFI", result: "win" },
    ],
    Aaron: [
      { league: "MLB", game: "Cleveland vs San Francisco", selection: "Cleveland ML", result: "win" },
      { league: "MLB", game: "Kansas City vs Athletics", selection: "Kansas City ML", result: "win" },
      { league: "MLB", game: "Chicago Cubs vs Chicago White Sox", selection: "Chicago Cubs ML", result: "win" },
    ],
  },
  records: {
    Dennis: { MLB: { wins: 7, losses: 5 } },
    Shaun: { MLB: { wins: 11, losses: 5 } },
    Aaron: { MLB: { wins: 6, losses: 5 } },
  },
};
