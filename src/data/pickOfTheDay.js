// Dancing With the Odds' "Pick of the Day" page. Update `date` to today
// whenever you refresh the picks below, then add each host's pick(s) to
// their array. Each pick can be:
//   { game: "Team A @ Team B", selection: "Team A -3.5", odds: "-110", note: "Optional extra context" }
// `note` is optional. Leave a host's array as [] if they haven't submitted
// a pick yet, the page will show a "no pick yet" placeholder for them.
//
// `records` tracks each host's overall Daily Picks win-loss record. Update wins/
// losses as picks are graded (a push doesn't need tracking unless you want
// to add a `pushes` field and display it too).

export const pickOfTheDay = {
  date: "2026-08-16",
  picks: {
    Dennis: [],
    Shaun: [
      { game: "Atlanta @ Arizona", selection: "YRFI" },
      { game: "Chicago @ St Louis", selection: "YRFI" },
      { game: "Texas @ Athletics", selection: "YRFI" },
    ],
    Aaron: [],
  },
  records: {
    Dennis: { wins: 1, losses: 2 },
    Shaun: { wins: 7, losses: 2 },
    Aaron: { wins: 2, losses: 1 },
  },
};
