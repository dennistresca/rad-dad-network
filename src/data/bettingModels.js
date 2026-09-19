// Dancing With the Odds' Model Tracker page. Tracks the season-long
// win/loss record of the two statistical betting models the hosts
// introduced on the show, based on EVERY game that fits each model's
// criteria this season, regardless of whether the guys actually bet on
// it. This is separate from both the personal Daily Picks and the
// official Road to $10K bets.
//
// `record` is the total wins/losses across every qualifying game so
// far this season (decided games only). `pending` is the count of
// qualifying games that haven't been played yet. Update both by
// re-scanning the season's completed/upcoming games against the rule
// below (spread + total from the closing line) whenever asked to
// refresh the tracker; `lastUpdated` should move to the date of that
// scan.

export const bettingModels = {
  collegeFootball: {
    name: "Shaun's College Blowout Model",
    introducedEpisode: "S4E2",
    rule: "Take the OVER when a team is favored by 24.5+ points and the total is under 55.5, the closer to 50 the better. About a 60% historical hit rate over roughly the last 10 college football seasons.",
    record: { wins: 23, losses: 13 },
    pending: 10,
    lastUpdated: "2026-09-19",
  },
  nfl: {
    name: "Dennis's NFL Road Dog Model",
    introducedEpisode: "S4E4",
    rule: "Take the road underdog against the spread when the game total is over 49. About a 57% hit rate over the last 12 NFL seasons (55% if the total cutoff drops to 48).",
    record: { wins: 1, losses: 2 },
    pending: 1,
    lastUpdated: "2026-09-19",
  },
};
