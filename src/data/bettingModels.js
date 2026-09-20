// Dancing With the Odds' Model Tracker page. Tracks the season-long
// win/loss record of the statistical betting models the hosts
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
//
// Dennis's NFL model has three tiers (the "Playable" one plus two wider,
// more diluted variants), so `nfl.tiers` is a list instead of one flat
// record. Add/remove tiers there as the model gets refined.

export const bettingModels = {
  collegeFootball: {
    name: "Shaun's College Blowout Model",
    introducedEpisode: "S4E2",
    rule: "Take the OVER when a team is favored by 24.5+ points and the total is under 55.5, the closer to 50 the better. About a 60% historical hit rate over roughly the last 10 college football seasons.",
    record: { wins: 28, losses: 18 },
    pending: 0,
    lastUpdated: "2026-09-20",
  },
  nfl: {
    name: "Dennis's NFL Road Dog Model",
    introducedEpisode: "S4E4",
    lastUpdated: "2026-09-19",
    tiers: [
      {
        label: "Tier 1 — Playable",
        rule: "Road underdog ATS when the total is 49 or higher. 57.1% hit rate, +9.9% ROI on 373 bets (~34/season) from 2015-2025, with both the 2015-20 and 2021-25 halves holding up on their own.",
        record: { wins: 1, losses: 2 },
        pending: 1,
      },
      {
        label: "Tier 2a — Diluted",
        rule: "Road underdog ATS when the total is 48 or higher. 55.6% hit rate, +6.8% ROI on 516 bets, about 40% more volume than Tier 1 for a 1.5-point weaker edge.",
        record: { wins: 1, losses: 2 },
        pending: 1,
      },
      {
        label: "Tier 2b — Diluted",
        rule: "Any road team ATS when the total is 48 or higher (adds road favorites, who hit only 53.0% on their own). 54.7% hit rate, +4.8% ROI on 812 bets.",
        record: { wins: 2, losses: 2 },
        pending: 1,
      },
    ],
  },
};
