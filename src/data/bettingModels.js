// Dancing With the Odds' Model Tracker page. Tracks the season-long
// win/loss record of the statistical betting models the hosts
// introduced on the show, based on EVERY game that fits each model's
// criteria this season, regardless of whether the guys actually bet on
// it. This is separate from both the personal Daily Picks and the
// official Road to $10K bets.
//
// Each model (and each NFL tier) carries a `games` list now, not just
// an aggregate record — the Model Tracker page links each record to a
// detail page (see ModelGames.jsx) that lists every qualifying game
// with its line, final score, and result. `record` and `pending` are
// still stored directly (rather than derived) so the summary cards
// don't need to recompute anything; keep them in sync with `games`
// when updating. Update all of it by re-scanning the season's
// completed/upcoming games against the rule below (spread + total
// from the closing line) whenever asked to refresh the tracker;
// `lastUpdated` should move to the date of that scan.
//
// Dennis's NFL model has three tiers (the "Playable" one plus two wider,
// more diluted variants), so `nfl.tiers` is a list instead of one flat
// record. Add/remove tiers there as the model gets refined. A game can
// appear in more than one tier's `games` list, since the tiers overlap.

const collegeFootballGames = [
  { date: "2026-08-29", matchup: "New Mexico State Aggies @ Florida State Seminoles", favorite: "Florida State Seminoles", spread: "-30.5", total: 53.5, finalScore: "NMSU 17 - FSU 34", result: "loss" },
  { date: "2026-09-03", matchup: "Akron Zips @ Wake Forest Demon Deacons", favorite: "Wake Forest Demon Deacons", spread: "-27.5", total: 50.5, finalScore: "AKR 16 - WAKE 38", result: "win" },
  { date: "2026-09-04", matchup: "Eastern Illinois Panthers @ Minnesota Golden Gophers", favorite: "Minnesota Golden Gophers", spread: "-42.5", total: 52.5, finalScore: "EIU 7 - MINN 59", result: "win" },
  { date: "2026-09-04", matchup: "UAB Blazers @ Illinois Fighting Illini", favorite: "Illinois Fighting Illini", spread: "-25.5", total: 53.5, finalScore: "UAB 23 - ILL 42", result: "win" },
  { date: "2026-09-05", matchup: "Miami Hurricanes @ Stanford Cardinal", favorite: "Miami Hurricanes", spread: "-24.5", total: 46.5, finalScore: "MIA 45 - STAN 6", result: "win" },
  { date: "2026-09-05", matchup: "UTEP Miners @ Oklahoma Sooners", favorite: "Oklahoma Sooners", spread: "-40.5", total: 51.5, finalScore: "UTEP 0 - OU 51", result: "loss" },
  { date: "2026-09-05", matchup: "Boise State Broncos @ Oregon Ducks", favorite: "Oregon Ducks", spread: "-24.5", total: 53.5, finalScore: "BOIS 27 - ORE 34", result: "win" },
  { date: "2026-09-05", matchup: "Missouri State Bears @ Texas A&M Aggies", favorite: "Texas A&M Aggies", spread: "-38.5", total: 53.5, finalScore: "MOST 0 - TA&M 50", result: "loss" },
  { date: "2026-09-05", matchup: "East Carolina Pirates @ Alabama Crimson Tide", favorite: "Alabama Crimson Tide", spread: "-28.5", total: 52.5, finalScore: "ECU 10 - ALA 48", result: "win" },
  { date: "2026-09-05", matchup: "Western Michigan Broncos @ Michigan Wolverines", favorite: "Michigan Wolverines", spread: "-27.5", total: 50.5, finalScore: "WMU 12 - MICH 13", result: "loss" },
  { date: "2026-09-05", matchup: "Northern Illinois Huskies @ Iowa Hawkeyes", favorite: "Iowa Hawkeyes", spread: "-31.5", total: 44.5, finalScore: "NIU 0 - IOWA 40", result: "loss" },
  { date: "2026-09-05", matchup: "Bryant Bulldogs @ Army Black Knights", favorite: "Army Black Knights", spread: "-37.5", total: 51.5, finalScore: "BRY 3 - ARMY 59", result: "win" },
  { date: "2026-09-05", matchup: "Kent State Golden Flashes @ South Carolina Gamecocks", favorite: "South Carolina Gamecocks", spread: "-35.5", total: 52.5, finalScore: "KENT 0 - SC 57", result: "win" },
  { date: "2026-09-05", matchup: "Southeast Missouri State Redhawks @ Iowa State Cyclones", favorite: "Iowa State Cyclones", spread: "-29.5", total: 52.5, finalScore: "SEMO 10 - ISU 38", result: "loss" },
  { date: "2026-09-05", matchup: "Towson Tigers @ Navy Midshipmen", favorite: "Navy Midshipmen", spread: "-31.5", total: 50.5, finalScore: "TOW 15 - NAVY 42", result: "win" },
  { date: "2026-09-05", matchup: "Fordham Rams @ North Dakota State Bison", favorite: "North Dakota State Bison", spread: "-41.5", total: 54.5, finalScore: "FOR 0 - NDSU 38", result: "loss" },
  { date: "2026-09-05", matchup: "Norfolk State Spartans @ Old Dominion Monarchs", favorite: "Old Dominion Monarchs", spread: "-41.5", total: 52.5, finalScore: "NORF 10 - ODU 31", result: "loss" },
  { date: "2026-09-05", matchup: "Charleston Southern Buccaneers @ Georgia Southern Eagles", favorite: "Georgia Southern Eagles", spread: "-28.5", total: 51.5, finalScore: "CHSO 0 - GASO 31", result: "loss" },
  { date: "2026-09-05", matchup: "UL Monroe Warhawks @ Mississippi State Bulldogs", favorite: "Mississippi State Bulldogs", spread: "-28.5", total: 54.5, finalScore: "ULM 13 - MSST 62", result: "win" },
  { date: "2026-09-06", matchup: "Mercyhurst Lakers @ New Mexico State Aggies", favorite: "New Mexico State Aggies", spread: "-29.5", total: 52.5, finalScore: "MERC 14 - NMSU 51", result: "win" },
  { date: "2026-09-06", matchup: "Morgan State Bears @ Arizona State Sun Devils", favorite: "Arizona State Sun Devils", spread: "-43.5", total: 52.5, finalScore: "MORG 7 - ASU 70", result: "win" },
  { date: "2026-09-11", matchup: "Richmond Spiders @ NC State Wolfpack", favorite: "NC State Wolfpack", spread: "-33.5", total: 50.5, finalScore: "RICH 0 - NCSU 73", result: "win" },
  { date: "2026-09-12", matchup: "Rice Owls @ Notre Dame Fighting Irish", favorite: "Notre Dame Fighting Irish", spread: "-44.5", total: 54.5, finalScore: "RICE 0 - ND 52", result: "loss" },
  { date: "2026-09-12", matchup: "Louisiana Tech Bulldogs @ LSU Tigers", favorite: "LSU Tigers", spread: "-34.5", total: 54.5, finalScore: "LT 14 - LSU 45", result: "win" },
  { date: "2026-09-12", matchup: "Texas Tech Red Raiders @ Oregon State Beavers", favorite: "Texas Tech Red Raiders", spread: "-25.5", total: 52.5, finalScore: "TTU 35 - ORST 24", result: "win" },
  { date: "2026-09-12", matchup: "Penn State Nittany Lions @ Temple Owls", favorite: "Penn State Nittany Lions", spread: "-24.5", total: 49.5, finalScore: "PSU 27 - TEM 9", result: "loss" },
  { date: "2026-09-12", matchup: "Holy Cross Crusaders @ Miami (OH) RedHawks", favorite: "Miami (OH) RedHawks", spread: "-30.5", total: 46.5, finalScore: "HC 7 - M-OH 45", result: "win" },
  { date: "2026-09-12", matchup: "Robert Morris Colonials @ Akron Zips", favorite: "Akron Zips", spread: "-26.5", total: 45.5, finalScore: "RMU 10 - AKR 45", result: "win" },
  { date: "2026-09-12", matchup: "Central Connecticut Blue Devils @ Toledo Rockets", favorite: "Toledo Rockets", spread: "-36.5", total: 52.5, finalScore: "CCSU 10 - TOL 63", result: "win" },
  { date: "2026-09-12", matchup: "Mercyhurst Lakers @ New Mexico Lobos", favorite: "New Mexico Lobos", spread: "-42.5", total: 54.5, finalScore: "MERC 7 - UNM 70", result: "win" },
  { date: "2026-09-12", matchup: "Monmouth Hawks @ Western Michigan Broncos", favorite: "Western Michigan Broncos", spread: "-29.5", total: 54.5, finalScore: "MONM 14 - WMU 49", result: "win" },
  { date: "2026-09-12", matchup: "Bowling Green Falcons @ Nebraska Cornhuskers", favorite: "Nebraska Cornhuskers", spread: "-30.5", total: 48.5, finalScore: "BGSU 7 - NEB 56", result: "win" },
  { date: "2026-09-12", matchup: "Western Illinois Leathernecks @ Wisconsin Badgers", favorite: "Wisconsin Badgers", spread: "-43.5", total: 53.5, finalScore: "WIU 9 - WIS 36", result: "loss" },
  { date: "2026-09-12", matchup: "Fordham Rams @ Coastal Carolina Chanticleers", favorite: "Coastal Carolina Chanticleers", spread: "-36.5", total: 54.5, finalScore: "FOR 7 - CCU 45", result: "loss" },
  { date: "2026-09-13", matchup: "Texas Southern Tigers @ UTEP Miners", favorite: "UTEP Miners", spread: "-27.5", total: 53.5, finalScore: "TXSO 10 - UTEP 51", result: "win" },
  { date: "2026-09-19", matchup: "Georgia Bulldogs @ Arkansas Razorbacks", favorite: "Georgia Bulldogs", spread: "-24.5", total: 54.5, finalScore: "UGA 45 - ARK 17", result: "win" },
  { date: "2026-09-19", matchup: "Michigan State Spartans @ Notre Dame Fighting Irish", favorite: "Notre Dame Fighting Irish", spread: "-28.5", total: 51.5, finalScore: "MSU 10 - ND 27", result: "loss" },
  { date: "2026-09-19", matchup: "Buffalo Bulls @ Penn State Nittany Lions", favorite: "Penn State Nittany Lions", spread: "-39.5", total: 48.5, finalScore: "BUFF 13 - PSU 55", result: "win" },
  { date: "2026-09-19", matchup: "Northern Iowa Panthers @ Iowa Hawkeyes", favorite: "Iowa Hawkeyes", spread: "-37.5", total: 48.5, finalScore: "UNI 0 - IOWA 55", result: "win" },
  { date: "2026-09-19", matchup: "UTEP Miners @ Michigan Wolverines", favorite: "Michigan Wolverines", spread: "-34.5", total: 48.5, finalScore: "UTEP 17 - MICH 52", result: "win" },
  { date: "2026-09-19", matchup: "Troy Trojans @ Missouri Tigers", favorite: "Missouri Tigers", spread: "-26.5", total: 49.5, finalScore: "TROY 17 - MIZ 27", result: "loss" },
  { date: "2026-09-19", matchup: "Maine Black Bears @ Boston College Eagles", favorite: "Boston College Eagles", spread: "-37.5", total: 54.5, finalScore: "ME 16 - BC 22", result: "loss" },
  { date: "2026-09-19", matchup: "Duquesne Dukes @ Washington State Cougars", favorite: "Washington State Cougars", spread: "-38.5", total: 51.5, finalScore: "DUQ 7 - WSU 48", result: "win" },
  { date: "2026-09-19", matchup: "Stonehill Skyhawks @ Massachusetts Minutemen", favorite: "Massachusetts Minutemen", spread: "-30.5", total: 50.5, finalScore: "STO 14 - MASS 36", result: "loss" },
  { date: "2026-09-20", matchup: "Northern Illinois Huskies @ Arizona Wildcats", favorite: "Arizona Wildcats", spread: "-34.5", total: 50.5, finalScore: "NIU 17 - ARIZ 42", result: "win" },
  { date: "2026-09-20", matchup: "North Dakota State Bison @ Sacramento State Hornets", favorite: "North Dakota State Bison", spread: "-26.5", total: 50.5, finalScore: "NDSU 31 - SAC 10", result: "loss" },
  { date: "2026-09-26", matchup: "Central Michigan Chippewas @ Miami Hurricanes", favorite: "Miami Hurricanes", spread: "-41.5", total: 52.5, finalScore: "CMU 3 - MIA 52", result: "win" },
  { date: "2026-09-26", matchup: "Illinois Fighting Illini @ Ohio State Buckeyes", favorite: "Ohio State Buckeyes", spread: "-25.5", total: 53.5, finalScore: "ILL 19 - OSU 42", result: "win" },
  { date: "2026-09-26", matchup: "Lindenwood Lions @ Eastern Michigan Eagles", favorite: "Eastern Michigan Eagles", spread: "-24.5", total: 53.5, finalScore: "LIN 3 - EMU 29", result: "loss" },
  { date: "2026-09-26", matchup: "Robert Morris Colonials @ Buffalo Bulls", favorite: "Buffalo Bulls", spread: "-27.5", total: 46.5, finalScore: "RMU 28 - BUFF 31", result: "win" },
  { date: "2026-09-26", matchup: "Stonehill Skyhawks @ Ohio Bobcats", favorite: "Ohio Bobcats", spread: "-32.5", total: 53.5, finalScore: "STO 7 - OHIO 35", result: "loss" },
  { date: "2026-09-26", matchup: "Long Island University Sharks @ Florida International Panthers", favorite: "Florida International Panthers", spread: "-37.5", total: 54.5, finalScore: "LIU 3 - FIU 20", result: "loss" },
  { date: "2026-10-03", matchup: "Vanderbilt Commodores @ Georgia Bulldogs", favorite: "Georgia Bulldogs", spread: "-25.5", total: 51.5, finalScore: "VAN 14 - UGA 38", result: "win" },
  { date: "2026-10-03", matchup: "Samford Bulldogs @ UAB Blazers", favorite: "UAB Blazers", spread: "-30.5", total: 50.5, finalScore: "SAM 14 - UAB 33", result: "loss" },
];

const nflTier1Games = [
  { date: "2026-09-13", matchup: "Tampa Bay Buccaneers @ Cincinnati Bengals", roadTeam: "Tampa Bay Buccaneers", spread: "+3.5", total: 50.5, finalScore: "TB 27 - CIN 33", result: "loss" },
  { date: "2026-09-13", matchup: "New Orleans Saints @ Detroit Lions", roadTeam: "New Orleans Saints", spread: "+7", total: 49.5, finalScore: "NO 30 - DET 31", result: "win" },
  { date: "2026-09-18", matchup: "Detroit Lions @ Buffalo Bills", roadTeam: "Detroit Lions", spread: "+5.5", total: 54.5, finalScore: "DET 31 - BUF 41", result: "loss" },
  { date: "2026-09-20", matchup: "Washington Commanders @ Dallas Cowboys", roadTeam: "Washington Commanders", spread: "+4.5", total: 51.5, finalScore: "WSH 20 - DAL 37", result: "loss" },
  { date: "2026-09-27", matchup: "Los Angeles Chargers @ Buffalo Bills", roadTeam: "Los Angeles Chargers", spread: "+7", total: 50.5, finalScore: "LAC 16 - BUF 24", result: "loss" },
  { date: "2026-09-27", matchup: "New York Jets @ Detroit Lions", roadTeam: "New York Jets", spread: "+7", total: 49.5, finalScore: "NYJ 24 - DET 31", result: "push" },
];

const nflTier2aGames = [
  ...nflTier1Games,
  { date: "2026-09-27", matchup: "Arizona Cardinals @ San Francisco 49ers", roadTeam: "Arizona Cardinals", spread: "+7.5", total: 48.5, finalScore: "ARI 30 - SF 36", result: "win" },
];

const nflTier2bGames = [
  { date: "2026-09-13", matchup: "Tampa Bay Buccaneers @ Cincinnati Bengals", roadTeam: "Tampa Bay Buccaneers", spread: "+3.5", total: 50.5, finalScore: "TB 27 - CIN 33", result: "loss" },
  { date: "2026-09-13", matchup: "New Orleans Saints @ Detroit Lions", roadTeam: "New Orleans Saints", spread: "+7", total: 49.5, finalScore: "NO 30 - DET 31", result: "win" },
  { date: "2026-09-13", matchup: "Baltimore Ravens @ Indianapolis Colts", roadTeam: "Baltimore Ravens (favorite)", spread: "-3", total: 48.5, finalScore: "BAL 41 - IND 23", result: "win" },
  { date: "2026-09-18", matchup: "Detroit Lions @ Buffalo Bills", roadTeam: "Detroit Lions", spread: "+5.5", total: 54.5, finalScore: "DET 31 - BUF 41", result: "loss" },
  { date: "2026-09-20", matchup: "Washington Commanders @ Dallas Cowboys", roadTeam: "Washington Commanders", spread: "+4.5", total: 51.5, finalScore: "WSH 20 - DAL 37", result: "loss" },
  { date: "2026-09-27", matchup: "Los Angeles Chargers @ Buffalo Bills", roadTeam: "Los Angeles Chargers", spread: "+7", total: 50.5, finalScore: "LAC 16 - BUF 24", result: "loss" },
  { date: "2026-09-27", matchup: "New York Jets @ Detroit Lions", roadTeam: "New York Jets", spread: "+7", total: 49.5, finalScore: "NYJ 24 - DET 31", result: "push" },
  { date: "2026-09-27", matchup: "Arizona Cardinals @ San Francisco 49ers", roadTeam: "Arizona Cardinals", spread: "+7.5", total: 48.5, finalScore: "ARI 30 - SF 36", result: "win" },
  { date: "2026-09-27", matchup: "Baltimore Ravens @ Dallas Cowboys", roadTeam: "Baltimore Ravens (favorite)", spread: "-3", total: 54.5, finalScore: "BAL 34 - DAL 31", result: "push" },
];

const windGames = [
  { date: "2026-09-13", matchup: "Miami Dolphins @ Las Vegas Raiders", wind: "19 mph", total: 40.5, finalScore: "MIA 13 - LV 27", result: "win" },
];

export const bettingModels = {
  collegeFootball: {
    name: "Shaun's College Blowout Model",
    introducedEpisode: "S4E2",
    rule: "Take the OVER when a team is favored by 24.5+ points and the total is under 55.5, the closer to 50 the better. About a 60% historical hit rate over roughly the last 10 college football seasons.",
    record: { wins: 32, losses: 22 },
    pending: 0,
    lastUpdated: "2026-10-04",
    games: collegeFootballGames,
  },
  nfl: {
    name: "Dennis's NFL Road Dog Model",
    introducedEpisode: "S4E4",
    lastUpdated: "2026-09-29",
    tiers: [
      {
        key: "tier-1",
        label: "Tier 1 — Playable",
        rule: "Road underdog ATS when the total is 49 or higher. 57.1% hit rate, +9.9% ROI on 373 bets (~34/season) from 2015-2025, with both the 2015-20 and 2021-25 halves holding up on their own.",
        record: { wins: 1, losses: 4, pushes: 1 },
        pending: 0,
        games: nflTier1Games,
      },
      {
        key: "tier-2a",
        label: "Tier 2a — Diluted",
        rule: "Road underdog ATS when the total is 48 or higher. 55.6% hit rate, +6.8% ROI on 516 bets, about 40% more volume than Tier 1 for a 1.5-point weaker edge.",
        record: { wins: 2, losses: 4, pushes: 1 },
        pending: 0,
        games: nflTier2aGames,
      },
      {
        key: "tier-2b",
        label: "Tier 2b — Diluted",
        rule: "Any road team ATS when the total is 48 or higher (adds road favorites, who hit only 53.0% on their own). 54.7% hit rate, +4.8% ROI on 812 bets.",
        record: { wins: 3, losses: 4, pushes: 2 },
        pending: 0,
        games: nflTier2bGames,
      },
    ],
  },
  aaronWind: {
    name: "Aaron's Wind Model",
    introducedEpisode: "S4E5",
    rule: "Take the UNDER when wind is 15+ mph at kickoff. 56.8% hit rate going back 10 seasons. Graded using nflweather.com's sustained wind reading at each stadium.",
    record: { wins: 1, losses: 0 },
    pending: 0,
    lastUpdated: "2026-09-29",
    games: windGames,
  },
};
