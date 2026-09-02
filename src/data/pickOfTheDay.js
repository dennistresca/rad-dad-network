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
  date: "2026-09-02",
  picks: {
    Dennis: [],
    Shaun: [],
    Aaron: [],
  },
  records: {
    Dennis: { MLB: { wins: 27, losses: 17 }, NFL: { wins: 0, losses: 1 }, NCAAF: { wins: 1, losses: 2 } },
    Shaun: { MLB: { wins: 22, losses: 19 }, NCAAF: { wins: 0, losses: 1 } },
    Aaron: { MLB: { wins: 18, losses: 28 }, NCAAF: { wins: 1, losses: 0 } },
  },
};

// The "Previous Picks" view on the Daily Picks page. Before resetting
// `pickOfTheDay` for a new day, add that day's fully-graded `date` and
// `picks` as a new entry here (not `records`, since records are
// cumulative and don't belong to a single day). Newest day first.
export const pickHistory = [
  {
    date: "2026-09-01",
    picks: {
      Dennis: [
        { league: "MLB", game: "San Diego vs Cincinnati", selection: "OVER 9.5 runs", odds: "-107", result: "loss" },
        { league: "MLB", game: "Philadelphia vs Arizona", selection: "Philadelphia ML", odds: "-141", result: "win" },
        { league: "MLB", game: "Tampa Bay vs New York Mets", selection: "Tampa Bay ML", odds: "-124", result: "win" },
      ],
      Shaun: [
        { league: "MLB", game: "Chicago Cubs @ Milwaukee", selection: "YRFI", result: "loss" },
        { league: "MLB", game: "Kansas City @ Miami", selection: "YRFI", result: "loss" },
      ],
      Aaron: [
        { league: "MLB", game: "Los Angeles Dodgers vs St Louis", selection: "Dodgers ML", odds: "-178", result: "loss" },
        { league: "MLB", game: "New York Yankees @ Los Angeles Angels", selection: "Gerrit Cole OVER 6.5 strikeouts", result: "loss" },
        { league: "MLB", game: "Philadelphia vs Arizona", selection: "UNDER 7.5 runs", odds: "-102", result: "loss" },
      ],
    },
  },
  {
    date: "2026-08-31",
    picks: {
      Dennis: [
        { league: "MLB", game: "Atlanta vs San Francisco", selection: "Atlanta -1.5", odds: "+141", result: "loss" },
        { league: "MLB", game: "Boston vs Seattle", selection: "Boston ML", odds: "-161", result: "win" },
        { league: "MLB", game: "Miami vs Washington", selection: "Miami ML", odds: "-116", result: "loss" },
      ],
      Shaun: [
        { league: "MLB", game: "San Francisco @ Atlanta", selection: "YRFI", result: "win" },
        { league: "MLB", game: "Chicago Cubs @ Milwaukee", selection: "YRFI", result: "win" },
      ],
      Aaron: [
        { league: "MLB", game: "Chicago Cubs @ Milwaukee", selection: "NRFI", result: "loss" },
        { league: "MLB", game: "Athletics @ Texas", selection: "YRFI", result: "loss" },
        { league: "MLB", game: "Boston vs Seattle", selection: "Payton Tolle OVER 6.5 strikeouts", result: "loss" },
      ],
    },
  },
  {
    date: "2026-08-30",
    picks: {
      Dennis: [
        { league: "MLB", game: "Washington vs Miami", selection: "Washington ML", odds: "+101", result: "loss" },
        { league: "MLB", game: "New York Mets vs Houston", selection: "New York Mets ML", odds: "-119", result: "loss" },
        { league: "MLB", game: "Cleveland vs Kansas City", selection: "Cleveland ML", odds: "-180", result: "win" },
      ],
      Shaun: [{ league: "MLB", game: "Houston @ New York Mets", selection: "YRFI", result: "win" }],
      Aaron: [
        { league: "MLB", game: "Atlanta vs Colorado", selection: "Braves ML", odds: "-250", result: "win" },
        { league: "MLB", game: "Washington vs Miami", selection: "Nationals ML", odds: "-115", result: "loss" },
        { league: "MLB", game: "New York Mets vs Houston", selection: "Mets ML", odds: "-128", result: "loss" },
      ],
    },
  },
  {
    date: "2026-08-29",
    picks: {
      Dennis: [
        { league: "NCAAF", game: "North Carolina vs TCU", selection: "North Carolina +9.5", result: "win" },
        { league: "NCAAF", game: "UNLV vs Memphis", selection: "UNLV -4.5", result: "loss" },
        { league: "NCAAF", game: "Hawaii @ Stanford", selection: "Hawaii +4", result: "loss" },
      ],
      Shaun: [
        { league: "MLB", game: "New York Yankees @ Boston", selection: "NRFI", result: "loss" },
        { league: "MLB", game: "Pittsburgh @ St Louis", selection: "NRFI", result: "loss" },
        { league: "NCAAF", game: "Hawaii @ Stanford", selection: "Hawaii ML", result: "loss" },
      ],
      Aaron: [
        { league: "MLB", game: "Atlanta vs Colorado", selection: "OVER 9 runs", result: "loss" },
        { league: "MLB", game: "Minnesota vs Chicago White Sox", selection: "Twins ML", odds: "-125", result: "loss" },
        { league: "NCAAF", game: "TCU vs North Carolina", selection: "UNDER 46.5", result: "win" },
      ],
    },
  },
  {
    date: "2026-08-28",
    picks: {
      Dennis: [
        { league: "MLB", game: "Cincinnati vs Chicago Cubs", selection: "OVER 8.5 runs", result: "win" },
        { league: "MLB", game: "Tampa Bay vs San Diego", selection: "Tampa Bay ML", odds: "-128", result: "win" },
        { league: "MLB", game: "Milwaukee vs Texas", selection: "Milwaukee ML", odds: "-174", result: "win" },
      ],
      Shaun: [
        { league: "MLB", game: "Chicago Cubs @ Cincinnati", selection: "YRFI", result: "win" },
        { league: "MLB", game: "Miami @ Washington", selection: "YRFI", result: "loss" },
      ],
      Aaron: [
        { league: "MLB", game: "Miami @ Washington", selection: "Marlins ML", odds: "-154", result: "loss" },
        { league: "MLB", game: "Cincinnati vs Chicago Cubs", selection: "OVER 8.5 runs", result: "win" },
        { league: "MLB", game: "New York Yankees vs Boston", selection: "Yankees ML", odds: "-167", result: "win" },
      ],
    },
  },
  {
    date: "2026-08-27",
    picks: {
      Dennis: [
        { league: "MLB", game: "Colorado vs Washington", selection: "OVER 9.5 runs", odds: "-102", result: "loss" },
        { league: "MLB", game: "Baltimore vs St Louis", selection: "Baltimore ML", odds: "-119", result: "loss" },
        { league: "NFL", game: "Buffalo vs Pittsburgh", selection: "Buffalo -3.5", result: "loss" },
      ],
      Shaun: [
        { league: "MLB", game: "Kansas City @ Toronto", selection: "NRFI", result: "loss" },
        { league: "MLB", game: "Milwaukee @ New York Mets", selection: "NRFI", result: "loss" },
        { league: "MLB", game: "Los Angeles Dodgers @ Atlanta", selection: "NRFI", result: "loss" },
      ],
      Aaron: [
        { league: "MLB", game: "Milwaukee @ New York Mets", selection: "Brewers ML", odds: "-210", result: "win" },
        { league: "MLB", game: "Atlanta vs Los Angeles Dodgers", selection: "UNDER 6.5 runs", odds: "-102", result: "win" },
        { league: "MLB", game: "Washington vs Colorado", selection: "Nationals ML", odds: "-122", result: "win" },
      ],
    },
  },
  {
    date: "2026-08-26",
    picks: {
      Dennis: [
        { league: "MLB", game: "Detroit vs Tampa Bay", selection: "Detroit ML", odds: "-116", result: "loss" },
        { league: "MLB", game: "Cleveland vs Los Angeles Angels", selection: "Cleveland ML", odds: "-135", result: "win" },
        { league: "MLB", game: "San Diego vs Pittsburgh", selection: "San Diego ML", odds: "-129", result: "win" },
      ],
      Shaun: [{ league: "MLB", game: "Milwaukee @ New York Mets", selection: "YRFI", result: "loss" }],
      Aaron: [
        { league: "MLB", game: "Philadelphia @ Seattle", selection: "Phillies ML", odds: "-108", result: "win" },
        { league: "MLB", game: "Chicago Cubs vs Arizona", selection: "OVER 8.5 runs", odds: "-118", result: "loss" },
        { league: "MLB", game: "Cleveland @ Los Angeles Angels", selection: "Guardians ML", odds: "-134", result: "win" },
      ],
    },
  },
  {
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
  },
  {
    date: "2026-08-24",
    picks: {
      Dennis: [
        { league: "MLB", game: "Tampa Bay vs Detroit", selection: "Tampa Bay ML", odds: "-130", result: "win" },
        { league: "MLB", game: "Washington vs Colorado", selection: "Washington ML", odds: "-185", result: "win" },
        { league: "MLB", game: "Minnesota vs Athletics", selection: "OVER 10.5 runs", odds: "-117", result: "win" },
      ],
      Shaun: [
        { league: "MLB", game: "Chicago Cubs @ Arizona", selection: "YRFI", result: "loss" },
        { league: "MLB", game: "Minnesota @ Athletics", selection: "YRFI", result: "win" },
      ],
      Aaron: [
        { league: "MLB", game: "San Diego vs Pittsburgh", selection: "Padres ML", odds: "-110", result: "loss" },
        { league: "MLB", game: "Cincinnati @ San Francisco", selection: "Reds ML", odds: "-161", result: "loss" },
        { league: "MLB", game: "Texas @ Chicago White Sox", selection: "Rangers ML", odds: "+115", result: "win" },
      ],
    },
  },
  {
    date: "2026-08-23",
    picks: {
      Dennis: [
        { league: "MLB", game: "Arizona vs Cincinnati", selection: "Arizona ML", odds: "-129", result: "win" },
        { league: "MLB", game: "San Diego vs Minnesota", selection: "San Diego ML", odds: "-136", result: "win" },
        { league: "MLB", game: "Seattle vs Chicago Cubs", selection: "Seattle ML", odds: "-101", result: "loss" },
      ],
      Shaun: [
        { league: "MLB", game: "San Francisco @ Boston", selection: "YRFI", result: "win" },
        { league: "MLB", game: "Tampa Bay @ Baltimore", selection: "YRFI", result: "loss" },
      ],
      Aaron: [
        { league: "MLB", game: "Kansas City vs Detroit", selection: "Royals ML", odds: "-102", result: "win" },
        { league: "MLB", game: "Minnesota @ San Diego", selection: "Twins ML", odds: "+118", result: "loss" },
        { league: "MLB", game: "Arizona vs Cincinnati", selection: "Diamondbacks ML", odds: "-135", result: "win" },
      ],
    },
  },
  {
    date: "2026-08-20",
    picks: {
      Dennis: [
        { league: "MLB", game: "St Louis vs Cincinnati", selection: "St Louis ML", odds: "-106", result: "win" },
        { league: "MLB", game: "Milwaukee vs Seattle", selection: "Milwaukee ML", odds: "-128", result: "win" },
        { league: "MLB", game: "Chicago White Sox vs Atlanta", selection: "Chicago White Sox ML", odds: "-102", result: "loss" },
      ],
      Shaun: [
        { league: "MLB", game: "St Louis @ Cincinnati", selection: "YRFI", result: "win" },
        { league: "MLB", game: "Atlanta @ Chicago White Sox", selection: "YRFI", result: "loss" },
      ],
      Aaron: [
        { league: "MLB", game: "Washington vs Texas", selection: "Nationals ML", odds: "+153", result: "loss" },
        { league: "MLB", game: "Houston vs Los Angeles Angels", selection: "Astros ML", odds: "-176", result: "loss" },
        { league: "MLB", game: "Chicago White Sox vs Atlanta", selection: "White Sox ML", odds: "-102", result: "loss" },
      ],
    },
  },
  {
    date: "2026-08-19",
    picks: {
      Dennis: [
        { league: "MLB", game: "Washington vs Texas", selection: "Washington ML", odds: "+120", result: "win" },
        { league: "MLB", game: "Kansas City vs Athletics", selection: "Kansas City ML", odds: "-158", result: "win" },
        { league: "MLB", game: "Miami vs Philadelphia", selection: "Miami ML", odds: "+121", result: "loss" },
      ],
      Shaun: [
        { league: "MLB", game: "Toronto @ Tampa Bay", selection: "NRFI", result: "loss" },
        { league: "MLB", game: "New York Yankees @ Baltimore", selection: "YRFI", result: "win" },
      ],
      Aaron: [
        { league: "MLB", game: "Minnesota vs Atlanta", selection: "Minnesota ML", odds: "-104", result: "win" },
        { league: "MLB", game: "Cleveland vs San Francisco", selection: "Cleveland ML", odds: "-210", result: "loss" },
        { league: "MLB", game: "Milwaukee vs Seattle", selection: "Milwaukee ML", odds: "-118", result: "loss" },
      ],
    },
  },
  {
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
  },
  {
    date: "2026-08-17",
    picks: {
      Dennis: [
        { league: "MLB", game: "Baltimore @ Tampa Bay", selection: "OVER 7.5 runs", result: "win" },
        { league: "MLB", selection: "New York Mets ML", odds: "-115", result: "win" },
      ],
      Shaun: [{ league: "MLB", game: "Miami @ Philadelphia", selection: "NRFI", result: "win" }],
      Aaron: [
        { league: "MLB", selection: "Pirates ML", odds: "-110", result: "loss" },
        { league: "MLB", selection: "Padres ML", odds: "+100", result: "loss" },
        { league: "MLB", selection: "Tampa Bay ML", odds: "-167", result: "win" },
      ],
    },
  },
  {
    date: "2026-08-16",
    picks: {
      Dennis: [
        { league: "MLB", game: "Baltimore @ Tampa Bay", selection: "OVER 7.5 runs", result: "win" },
        { league: "MLB", selection: "Boston ML", odds: "-120", result: "loss" },
        { league: "MLB", selection: "San Diego ML", odds: "-105", result: "win" },
      ],
      Shaun: [
        { league: "MLB", game: "Atlanta @ Arizona", selection: "YRFI", result: "loss" },
        { league: "MLB", game: "Chicago @ St Louis", selection: "YRFI", result: "win" },
        { league: "MLB", game: "Texas @ Athletics", selection: "YRFI", result: "loss" },
      ],
      Aaron: [
        { league: "MLB", selection: "Cincinnati ML", odds: "+105", result: "loss" },
        { league: "MLB", selection: "Washington ML", odds: "+140", result: "loss" },
      ],
    },
  },
];
