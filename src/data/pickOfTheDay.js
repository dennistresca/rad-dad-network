// Dancing With the Odds' "Pick of the Day" page. Update `date` to today
// whenever you refresh the picks below, then add each host's pick(s) to
// their array. Each pick can be:
//   { game: "Team A @ Team B", selection: "Team A -3.5", odds: "-110", note: "Optional extra context", result: "win" }
// `note` and `result` are optional. `result` can be "win" or "loss" to show
// a checkmark/X once a pick is graded; leave it off while still pending.
// Leave a host's array as [] if they haven't submitted a pick yet, the
// page will show a "no pick yet" placeholder for them.
//
// `records` tracks each host's overall Daily Picks win-loss record. Update wins/
// losses as picks are graded (a push doesn't need tracking unless you want
// to add a `pushes` field and display it too).

export const pickOfTheDay = {
  date: "2026-08-16",
  picks: {
    Dennis: [
      { game: "Baltimore @ Tampa Bay", selection: "OVER 7.5 runs", result: "win" },
      { selection: "Boston ML", odds: "-120", result: "loss" },
      { selection: "San Diego ML", odds: "-105", result: "win" },
    ],
    Shaun: [
      { game: "Atlanta @ Arizona", selection: "YRFI", result: "loss" },
      { game: "Chicago @ St Louis", selection: "YRFI", result: "win" },
      { game: "Texas @ Athletics", selection: "YRFI", result: "loss" },
    ],
    Aaron: [
      { selection: "Cincinnati ML", odds: "+105", result: "loss" },
      { selection: "Washington ML", odds: "+140", result: "loss" },
    ],
  },
  records: {
    Dennis: { wins: 1, losses: 3 },
    Shaun: { wins: 7, losses: 2 },
    Aaron: { wins: 2, losses: 1 },
  },
};
