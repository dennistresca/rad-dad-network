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
  date: "2026-08-20",
  picks: {
    Dennis: [
      { league: "MLB", game: "St Louis vs Cincinnati", selection: "St Louis ML", odds: "-106", result: "win" },
      { league: "MLB", game: "Milwaukee vs Seattle", selection: "Milwaukee ML", odds: "-128" },
      { league: "MLB", game: "Chicago White Sox vs Atlanta", selection: "Chicago White Sox ML", odds: "-102", result: "loss" },
    ],
    Shaun: [
      { league: "MLB", game: "St Louis @ Cincinnati", selection: "YRFI", result: "win" },
      { league: "MLB", game: "Atlanta @ Chicago White Sox", selection: "YRFI", result: "loss" },
    ],
    Aaron: [
      { league: "MLB", game: "Washington vs Texas", selection: "Nationals ML", odds: "+153" },
      { league: "MLB", game: "Houston vs Los Angeles Angels", selection: "Astros ML", odds: "-176" },
      { league: "MLB", game: "Chicago White Sox vs Atlanta", selection: "White Sox ML", odds: "-102", result: "loss" },
    ],
  },
  records: {
    Dennis: { MLB: { wins: 10, losses: 7 } },
    Shaun: { MLB: { wins: 13, losses: 7 } },
    Aaron: { MLB: { wins: 7, losses: 8 } },
  },
};
