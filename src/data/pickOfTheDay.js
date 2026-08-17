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
// `records` tracks each host's overall Daily Picks win-loss record. Update wins/
// losses as picks are graded (a push doesn't need tracking unless you want
// to add a `pushes` field and display it too).

export const pickOfTheDay = {
  date: "2026-08-17",
  picks: {
    Dennis: [
      { league: "MLB", game: "Baltimore @ Tampa Bay", selection: "OVER 7.5 runs" },
      { league: "MLB", selection: "New York Mets ML", odds: "-115" },
    ],
    Shaun: [{ league: "MLB", game: "Miami @ Philadelphia", selection: "NRFI" }],
    Aaron: [
      { league: "MLB", selection: "Pirates ML", odds: "-110" },
      { league: "MLB", selection: "Padres ML", odds: "+100" },
      { league: "MLB", selection: "Tampa Bay ML", odds: "-167" },
    ],
  },
  records: {
    Dennis: { wins: 3, losses: 4 },
    Shaun: { wins: 8, losses: 4 },
    Aaron: { wins: 2, losses: 3 },
  },
};
