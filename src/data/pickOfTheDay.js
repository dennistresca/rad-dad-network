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
  date: "2026-08-26",
  picks: {
    Dennis: [
      { league: "MLB", game: "Detroit vs Tampa Bay", selection: "Detroit ML", odds: "-116" },
      { league: "MLB", game: "Cleveland vs Los Angeles Angels", selection: "Cleveland ML", odds: "-135" },
      { league: "MLB", game: "San Diego vs Pittsburgh", selection: "San Diego ML", odds: "-129" },
    ],
    Shaun: [{ league: "MLB", game: "Milwaukee @ New York Mets", selection: "YRFI" }],
    Aaron: [
      { league: "MLB", game: "Philadelphia @ Seattle", selection: "Phillies ML", odds: "-108" },
      { league: "MLB", game: "Chicago Cubs vs Arizona", selection: "OVER 8.5 runs", odds: "-118" },
      { league: "MLB", game: "Cleveland @ Los Angeles Angels", selection: "Guardians ML", odds: "-134" },
    ],
  },
  records: {
    Dennis: { MLB: { wins: 18, losses: 9 } },
    Shaun: { MLB: { wins: 18, losses: 10 } },
    Aaron: { MLB: { wins: 10, losses: 16 } },
  },
};

// The "Yesterday's Picks" view on the Daily Picks page. Before resetting
// `pickOfTheDay` for a new day, copy that day's fully-graded `date` and
// `picks` here (not `records`, since records are cumulative and don't
// belong to a single day). This only ever holds one day, not a full
// history.
export const previousDayPicks = {
  date: "2026-08-25",
  picks: {
    Dennis: [
      { league: "MLB", game: "Cleveland vs Los Angeles Angels", selection: "Cleveland ML", odds: "-140", result: "win" },
      { league: "MLB", game: "Philadelphia vs Seattle", selection: "First 5 Innings UNDER 4.5", result: "win" },
      { league: "MLB", game: "San Diego vs Pittsburgh", selection: "San Diego ML", odds: "-123", result: "loss" },
    ],
    Shaun: [
      { league: "MLB", game: "Baltimore @ St Louis", selection: "NRFI", result: "win" },
      { league: "MLB", game: "Chicago Cubs @ Arizona", selection: "NRFI", result: "win" },
      { league: "MLB", game: "Houston @ New York Yankees", selection: "YRFI", result: "loss" },
      { league: "MLB", game: "Los Angeles Dodgers @ Atlanta", selection: "YRFI", result: "win" },
    ],
    Aaron: [
      { league: "MLB", game: "Tampa Bay @ Detroit", selection: "Rays ML", odds: "-126", result: "loss" },
      { league: "MLB", game: "Milwaukee @ New York Mets", selection: "Brewers ML", odds: "-158", result: "loss" },
      { league: "MLB", game: "Washington vs Colorado", selection: "Nationals ML", odds: "+130", result: "loss" },
    ],
  },
};
