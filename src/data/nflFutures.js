// Dancing With the Odds' NFL Futures page. One-time, season-long picks
// made at the start of the season (Season 4, Episode 2), not the
// day-to-day Daily Picks. Each host picks a champion for all 8 NFL
// divisions plus a conference champion for the AFC and NFC, and an
// overall Super Bowl champion.
//
// Each pick can be: { team: "Team Name", odds: "+600", result: "win" }
// `odds` is optional (leave it off if the host didn't state exact odds).
// `result` can be "win" or "loss" once the season resolves; leave it off
// while the pick is still pending. `odds` below reflect current
// DraftKings futures lines as of 2026-09-13 (via ESPN's futures feed),
// not necessarily the exact price each host got when they made the
// pick. AFC West wasn't available on that feed, so those odds are left
// as originally stated on the show.

export const nflFutures = {
  season: "2026",
  recordedDate: "2026-09-02",
  categories: [
    { key: "afcEast", label: "AFC East Champion" },
    { key: "afcNorth", label: "AFC North Champion" },
    { key: "afcSouth", label: "AFC South Champion" },
    { key: "afcWest", label: "AFC West Champion" },
    { key: "nfcEast", label: "NFC East Champion" },
    { key: "nfcNorth", label: "NFC North Champion" },
    { key: "nfcSouth", label: "NFC South Champion" },
    { key: "nfcWest", label: "NFC West Champion" },
    { key: "afcChampion", label: "AFC Champion" },
    { key: "nfcChampion", label: "NFC Champion" },
    { key: "superBowlChampion", label: "Super Bowl Champion" },
  ],
  picks: {
    Dennis: {
      afcEast: { team: "New England Patriots", odds: "+170" },
      afcNorth: { team: "Baltimore Ravens", odds: "-110" },
      afcSouth: { team: "Houston Texans", odds: "+144" },
      afcWest: { team: "Kansas City Chiefs" },
      nfcEast: { team: "Dallas Cowboys", odds: "+205" },
      nfcNorth: { team: "Detroit Lions", odds: "+150" },
      nfcSouth: { team: "Tampa Bay Buccaneers", odds: "+184" },
      nfcWest: { team: "Los Angeles Rams", odds: "+194" },
      afcChampion: { team: "Baltimore Ravens", odds: "+475" },
      nfcChampion: { team: "Los Angeles Rams", odds: "+440" },
      superBowlChampion: { team: "Los Angeles Rams", odds: "+650" },
    },
    Shaun: {
      afcEast: { team: "Buffalo Bills", odds: "-170" },
      afcNorth: { team: "Cincinnati Bengals", odds: "+160" },
      afcSouth: { team: "Houston Texans", odds: "+144" },
      afcWest: { team: "Kansas City Chiefs" },
      nfcEast: { team: "Dallas Cowboys", odds: "+205" },
      nfcNorth: { team: "Detroit Lions", odds: "+150" },
      nfcSouth: { team: "New Orleans Saints", odds: "+215" },
      nfcWest: { team: "Los Angeles Rams", odds: "+194" },
      afcChampion: { team: "Buffalo Bills", odds: "+510" },
      nfcChampion: { team: "Los Angeles Rams", odds: "+440" },
      superBowlChampion: { team: "Los Angeles Rams", odds: "+650" },
    },
    Aaron: {
      afcEast: { team: "New England Patriots", odds: "+170" },
      afcNorth: { team: "Cincinnati Bengals", odds: "+160" },
      afcSouth: { team: "Houston Texans", odds: "+144" },
      afcWest: { team: "Denver Broncos", odds: "+210" },
      nfcEast: { team: "New York Giants", odds: "+650" },
      nfcNorth: { team: "Chicago Bears", odds: "+270" },
      nfcSouth: { team: "Tampa Bay Buccaneers", odds: "+184" },
      nfcWest: { team: "Los Angeles Rams", odds: "+194" },
      afcChampion: { team: "Houston Texans", odds: "+960" },
      nfcChampion: { team: "Los Angeles Rams", odds: "+440" },
      superBowlChampion: { team: "Los Angeles Rams", odds: "+650" },
    },
  },
};
