// Dancing With the Odds' "Pick of the Day" page. Update `date` to today
// whenever you refresh the picks below, then add each host's pick(s) to
// their array. Each pick can be:
//   { game: "Team A @ Team B", selection: "Team A -3.5", odds: "-110", note: "Optional extra context" }
// `note` is optional. Leave a host's array as [] if they haven't submitted
// a pick yet, the page will show a "no pick yet" placeholder for them.

export const pickOfTheDay = {
  date: "2026-08-13",
  picks: {
    Dennis: [{ selection: "Miami Marlins", odds: "+110" }],
    Shaun: [],
    Aaron: [],
  },
};
