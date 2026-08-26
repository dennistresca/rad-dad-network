// Dancing With the Odds' College Football Futures page. One-time,
// season-long picks made at the start of the season (Season 4, Episode 1),
// not the day-to-day Daily Picks. Each host picks a champion for each
// Power 4 conference plus an overall National Champion.
//
// Each pick can be: { team: "Team Name", odds: "+600", result: "win" }
// `odds` is optional (leave it off if the host didn't state exact odds).
// `result` can be "win" or "loss" once the season resolves; leave it off
// while the pick is still pending.

export const collegeFootballFutures = {
  season: "2026",
  recordedDate: "2026-08-24",
  categories: [
    { key: "acc", label: "ACC Champion" },
    { key: "bigTen", label: "Big Ten Champion" },
    { key: "big12", label: "Big 12 Champion" },
    { key: "sec", label: "SEC Champion" },
    { key: "nationalChampion", label: "National Champion" },
  ],
  picks: {
    Dennis: {
      acc: { team: "SMU", odds: "+600" },
      bigTen: { team: "Ohio State", odds: "+180" },
      big12: { team: "Kansas State", odds: "+1900" },
      sec: { team: "LSU", odds: "+900" },
      nationalChampion: { team: "Miami", odds: "+1100" },
    },
    Shaun: {
      acc: { team: "Louisville", odds: "+700" },
      bigTen: { team: "Indiana" },
      big12: { team: "Texas Tech", odds: "-117" },
      sec: { team: "Texas" },
      nationalChampion: { team: "Oregon", odds: "+614" },
    },
    Aaron: {
      acc: { team: "Miami", odds: "-130" },
      bigTen: { team: "Oregon", odds: "+257" },
      big12: { team: "Texas Tech", odds: "-117" },
      sec: { team: "Texas", odds: "+300" },
      nationalChampion: { team: "Oregon", odds: "+669" },
    },
  },
};
