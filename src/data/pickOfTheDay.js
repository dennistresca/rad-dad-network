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
  date: "2026-08-24",
  picks: {
    Dennis: [
      { league: "MLB", game: "Tampa Bay vs Detroit", selection: "Tampa Bay ML", odds: "-130", result: "win" },
      { league: "MLB", game: "Washington vs Colorado", selection: "Washington ML", odds: "-185", result: "win" },
      { league: "MLB", game: "Minnesota vs Athletics", selection: "OVER 10.5 runs", odds: "-117" },
    ],
    Shaun: [
      { league: "MLB", game: "Chicago Cubs @ Arizona", selection: "YRFI", result: "loss" },
      { league: "MLB", game: "Minnesota @ Athletics", selection: "YRFI", result: "win" },
    ],
    Aaron: [
      { league: "MLB", game: "San Diego vs Pittsburgh", selection: "Padres ML", odds: "-110" },
      { league: "MLB", game: "Cincinnati @ San Francisco", selection: "Reds ML", odds: "-161" },
      { league: "MLB", game: "Texas @ Chicago White Sox", selection: "Rangers ML", odds: "+115" },
    ],
  },
  records: {
    Dennis: { MLB: { wins: 15, losses: 8 } },
    Shaun: { MLB: { wins: 15, losses: 9 } },
    Aaron: { MLB: { wins: 9, losses: 11 } },
  },
};
