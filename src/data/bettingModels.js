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
  { date: "2026-10-10", matchup: "Ball State Cardinals @ Northwestern Wildcats", favorite: "Northwestern Wildcats", spread: "-36.5", total: 52.5, finalScore: "BALL 14 - NU 45", result: "win" },
  { date: "2026-10-10", matchup: "Stanford Cardinal @ Notre Dame Fighting Irish", favorite: "Notre Dame Fighting Irish", spread: "-38.5", total: 54.5, finalScore: "STAN 7 - ND 58", result: "win" },
  { date: "2026-10-17", matchup: "Charleston Southern Buccaneers @ Clemson Tigers", favorite: "Clemson Tigers", spread: "-42.5", total: 53.5, finalScore: "CHSO 0 - CLEM 37", result: "loss" },
];

const nflTier1Games = [
  { date: "2026-09-13", matchup: "Tampa Bay Buccaneers @ Cincinnati Bengals", roadTeam: "Tampa Bay Buccaneers", spread: "+3.5", total: 50.5, finalScore: "TB 27 - CIN 33", result: "loss" },
  { date: "2026-09-13", matchup: "New Orleans Saints @ Detroit Lions", roadTeam: "New Orleans Saints", spread: "+7", total: 49.5, finalScore: "NO 30 - DET 31", result: "win" },
  { date: "2026-09-18", matchup: "Detroit Lions @ Buffalo Bills", roadTeam: "Detroit Lions", spread: "+5.5", total: 54.5, finalScore: "DET 31 - BUF 41", result: "loss" },
  { date: "2026-09-20", matchup: "Washington Commanders @ Dallas Cowboys", roadTeam: "Washington Commanders", spread: "+4.5", total: 51.5, finalScore: "WSH 20 - DAL 37", result: "loss" },
  { date: "2026-09-27", matchup: "Los Angeles Chargers @ Buffalo Bills", roadTeam: "Los Angeles Chargers", spread: "+7", total: 50.5, finalScore: "LAC 16 - BUF 24", result: "loss" },
  { date: "2026-09-27", matchup: "New York Jets @ Detroit Lions", roadTeam: "New York Jets", spread: "+7", total: 49.5, finalScore: "NYJ 24 - DET 31", result: "push" },
  { date: "2026-10-04", matchup: "Jacksonville Jaguars @ Cincinnati Bengals", roadTeam: "Jacksonville Jaguars", spread: "+2.5", total: 51.5, finalScore: "JAX 22 - CIN 17", result: "win" },
  { date: "2026-10-12", matchup: "Buffalo Bills @ Los Angeles Rams", roadTeam: "Buffalo Bills", spread: "+3", total: 54.5, finalScore: "BUF 37 - LAR 34", result: "win" },
  { date: "2026-10-18", matchup: "Arizona Cardinals @ Los Angeles Rams", roadTeam: "Arizona Cardinals", spread: "+12.5", total: 51, finalScore: "ARI 18 - LAR 16", result: "win" },
  { date: "2026-10-19", matchup: "Washington Commanders @ San Francisco 49ers", roadTeam: "Washington Commanders", spread: "+7.5", total: 51.5, finalScore: "WSH 17 - SF 23", result: "win" },
];

const nflTier2aGames = [
  ...nflTier1Games,
  { date: "2026-09-27", matchup: "Arizona Cardinals @ San Francisco 49ers", roadTeam: "Arizona Cardinals", spread: "+7.5", total: 48.5, finalScore: "ARI 30 - SF 36", result: "win" },
  { date: "2026-10-04", matchup: "New England Patriots @ Buffalo Bills", roadTeam: "New England Patriots", spread: "+6.5", total: 48.5, finalScore: "NE 29 - BUF 26", result: "win" },
  { date: "2026-10-08", matchup: "Tampa Bay Buccaneers @ Dallas Cowboys", roadTeam: "Tampa Bay Buccaneers", spread: "+8.5", total: 48.5, finalScore: "TB 24 - DAL 16", result: "win" },
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
  { date: "2026-10-04", matchup: "Jacksonville Jaguars @ Cincinnati Bengals", roadTeam: "Jacksonville Jaguars", spread: "+2.5", total: 51.5, finalScore: "JAX 22 - CIN 17", result: "win" },
  { date: "2026-10-04", matchup: "New England Patriots @ Buffalo Bills", roadTeam: "New England Patriots", spread: "+6.5", total: 48.5, finalScore: "NE 29 - BUF 26", result: "win" },
  { date: "2026-10-04", matchup: "Detroit Lions @ Carolina Panthers", roadTeam: "Detroit Lions (favorite)", spread: "-3.5", total: 50.5, finalScore: "DET 26 - CAR 32", result: "loss" },
  { date: "2026-10-08", matchup: "Tampa Bay Buccaneers @ Dallas Cowboys", roadTeam: "Tampa Bay Buccaneers", spread: "+8.5", total: 48.5, finalScore: "TB 24 - DAL 16", result: "win" },
  { date: "2026-10-11", matchup: "Detroit Lions @ Arizona Cardinals", roadTeam: "Detroit Lions (favorite)", spread: "-5.5", total: 54.5, finalScore: "DET 45 - ARI 21", result: "win" },
  { date: "2026-10-12", matchup: "Buffalo Bills @ Los Angeles Rams", roadTeam: "Buffalo Bills", spread: "+3", total: 54.5, finalScore: "BUF 37 - LAR 34", result: "win" },
  { date: "2026-10-18", matchup: "Chicago Bears @ Atlanta Falcons", roadTeam: "Chicago Bears (favorite)", spread: "-1.5", total: 51.5, finalScore: "CHI 31 - ATL 23", result: "win" },
  { date: "2026-10-18", matchup: "Arizona Cardinals @ Los Angeles Rams", roadTeam: "Arizona Cardinals", spread: "+12.5", total: 51, finalScore: "ARI 18 - LAR 16", result: "win" },
  { date: "2026-10-18", matchup: "Buffalo Bills @ Las Vegas Raiders", roadTeam: "Buffalo Bills (favorite)", spread: "-4.5", total: 54, finalScore: "BUF 33 - LV 30", result: "loss" },
  { date: "2026-10-18", matchup: "Dallas Cowboys @ Green Bay Packers", roadTeam: "Dallas Cowboys (favorite)", spread: "-1.5", total: 54, finalScore: "DAL 13 - GB 23", result: "loss" },
  { date: "2026-10-19", matchup: "Washington Commanders @ San Francisco 49ers", roadTeam: "Washington Commanders", spread: "+7.5", total: 51.5, finalScore: "WSH 17 - SF 23", result: "win" },
];

// Shaun's College Under Model. `str` is the spread-to-total ratio (spread
// divided by total), shown to two decimals; the model wants 0.20 to 0.25.
const collegeUnderGames = [
  { date: "2026-09-04", matchup: "Toledo Rockets @ Michigan State Spartans", favorite: "Michigan State Spartans", spread: "-10", total: 48.5, str: "0.20", finalScore: "TOL 20 - MSU 30", result: "loss" },
  { date: "2026-09-05", matchup: "Oklahoma State Cowboys @ Tulsa Golden Hurricane", favorite: "Oklahoma State Cowboys", spread: "-13.5", total: 57.5, str: "0.23", finalScore: "OKST 10 - TLSA 24", result: "win" },
  { date: "2026-09-05", matchup: "Arkansas State Red Wolves @ Memphis Tigers", favorite: "Memphis Tigers", spread: "-10.5", total: 52.5, str: "0.20", finalScore: "ARST 24 - MEM 42", result: "loss" },
  { date: "2026-09-05", matchup: "Southeastern Louisiana Lions @ South Alabama Jaguars", favorite: "South Alabama Jaguars", spread: "-13.5", total: 53.5, str: "0.25", finalScore: "SELA 14 - USA 39", result: "win" },
  { date: "2026-09-05", matchup: "Central Michigan Chippewas @ New Mexico Lobos", favorite: "New Mexico Lobos", spread: "-11.5", total: 47.5, str: "0.24", finalScore: "CMU 7 - UNM 38", result: "win" },
  { date: "2026-09-12", matchup: "Wofford Terriers @ Kent State Golden Flashes", favorite: "Kent State Golden Flashes", spread: "-10", total: 45.5, str: "0.21", finalScore: "WOF 15 - KENT 36", result: "loss" },
  { date: "2026-09-12", matchup: "Stony Brook Seawolves @ Ball State Cardinals", favorite: "Ball State Cardinals", spread: "-13.5", total: 52.5, str: "0.25", finalScore: "STBK 17 - BALL 41", result: "loss" },
  { date: "2026-09-12", matchup: "Alabama Crimson Tide @ Kentucky Wildcats", favorite: "Alabama Crimson Tide", spread: "-9.5", total: 47.5, str: "0.20", finalScore: "ALA 45 - UK 17", result: "loss" },
  { date: "2026-09-12", matchup: "Maryland Terrapins @ UConn Huskies", favorite: "Maryland Terrapins", spread: "-11.5", total: 52.5, str: "0.21", finalScore: "MD 38 - UCONN 14", result: "win" },
  { date: "2026-09-12", matchup: "Tennessee Volunteers @ Georgia Tech Yellow Jackets", favorite: "Tennessee Volunteers", spread: "-12.5", total: 55.5, str: "0.22", finalScore: "TENN 45 - GT 24", result: "loss" },
  { date: "2026-09-12", matchup: "Middle Tennessee Blue Raiders @ Marshall Thundering Herd", favorite: "Marshall Thundering Herd", spread: "-11.5", total: 56.5, str: "0.20", finalScore: "MTSU 26 - MRSH 28", result: "win" },
  { date: "2026-09-12", matchup: "Tulsa Golden Hurricane @ Sam Houston Bearkats", favorite: "Tulsa Golden Hurricane", spread: "-12.5", total: 51.5, str: "0.24", finalScore: "TLSA 23 - SHSU 17", result: "win" },
  { date: "2026-09-12", matchup: "San Diego State Aztecs @ UCLA Bruins", favorite: "UCLA Bruins", spread: "-13.5", total: 53.5, str: "0.25", finalScore: "SDSU 10 - UCLA 28", result: "win" },
  { date: "2026-09-12", matchup: "Arkansas Razorbacks @ Utah Utes", favorite: "Utah Utes", spread: "-13.5", total: 55.5, str: "0.24", finalScore: "ARK 10 - UTAH 43", result: "win" },
  { date: "2026-09-17", matchup: "Syracuse Orange @ Pittsburgh Panthers", favorite: "Pittsburgh Panthers", spread: "-10.5", total: 51.5, str: "0.20", finalScore: "SYR 13 - PITT 27", result: "win" },
  { date: "2026-09-19", matchup: "West Virginia Mountaineers vs Virginia Cavaliers (Charlotte)", favorite: "Virginia Cavaliers", spread: "-10.5", total: 51.5, str: "0.20", finalScore: "WVU 38 - UVA 27", result: "loss" },
  { date: "2026-09-26", matchup: "Wake Forest Demon Deacons @ Louisville Cardinals", favorite: "Louisville Cardinals", spread: "-11.5", total: 57.5, str: "0.20", finalScore: "WAKE 30 - LOU 27", result: "win" },
  { date: "2026-09-26", matchup: "UNLV Rebels @ Akron Zips", favorite: "UNLV Rebels", spread: "-13.5", total: 52.5, str: "0.25", finalScore: "UNLV 38 - AKR 10", result: "win" },
  { date: "2026-09-26", matchup: "New Mexico Lobos @ New Mexico State Aggies", favorite: "New Mexico Lobos", spread: "-11.5", total: 47.5, str: "0.24", finalScore: "UNM 42 - NMSU 18", result: "loss" },
  { date: "2026-09-26", matchup: "Wisconsin Badgers @ Penn State Nittany Lions", favorite: "Penn State Nittany Lions", spread: "-10", total: 43.5, str: "0.22", finalScore: "WIS 24 - PSU 20", result: "loss" },
  { date: "2026-09-26", matchup: "South Carolina Gamecocks @ Alabama Crimson Tide", favorite: "Alabama Crimson Tide", spread: "-12.5", total: 53.5, str: "0.23", finalScore: "SC 18 - ALA 49", result: "loss" },
  { date: "2026-09-26", matchup: "Arizona Wildcats @ Washington State Cougars", favorite: "Arizona Wildcats", spread: "-11.5", total: 47.5, str: "0.24", finalScore: "ARIZ 34 - WSU 24", result: "loss" },
  { date: "2026-09-26", matchup: "Appalachian State Mountaineers @ NC State Wolfpack", favorite: "NC State Wolfpack", spread: "-12.5", total: 56.5, str: "0.22", finalScore: "APP 31 - NCSU 41", result: "loss" },
  { date: "2026-09-26", matchup: "Oregon State Beavers @ UTEP Miners", favorite: "Oregon State Beavers", spread: "-11.5", total: 56.5, str: "0.20", finalScore: "ORST 33 - UTEP 7", result: "win" },
  { date: "2026-10-03", matchup: "UCF Knights @ Houston Cougars", favorite: "Houston Cougars", spread: "-10.5", total: 50.5, str: "0.20", finalScore: "UCF 17 - HOU 27", result: "win" },
  { date: "2026-10-03", matchup: "Bowling Green Falcons @ Miami (OH) RedHawks", favorite: "Miami (OH) RedHawks", spread: "-10.5", total: 41.5, str: "0.25", finalScore: "BGSU 24 - M-OH 20", result: "loss" },
  { date: "2026-10-03", matchup: "Louisiana-Monroe Warhawks @ South Alabama Jaguars", favorite: "South Alabama Jaguars", spread: "-13.5", total: 56.5, str: "0.23", finalScore: "ULM 35 - USA 52", result: "loss" },
  { date: "2026-10-03", matchup: "UTSA Roadrunners vs Rice Owls (Houston)", favorite: "UTSA Roadrunners", spread: "-11.5", total: 56.5, str: "0.20", finalScore: "UTSA 16 - RICE 14", result: "win" },
  { date: "2026-10-08", matchup: "Sam Houston Bearkats @ Liberty Flames", favorite: "Liberty Flames", spread: "-13.5", total: 52.5, str: "0.25", finalScore: "SHSU 3 - LIB 35", result: "win" },
  { date: "2026-10-09", matchup: "Iowa State Cyclones @ BYU Cougars", favorite: "BYU Cougars", spread: "-10.5", total: 46.5, str: "0.22", finalScore: "ISU 10 - BYU 24", result: "win" },
  { date: "2026-10-10", matchup: "Rice Owls @ East Carolina Pirates", favorite: "East Carolina Pirates", spread: "-10", total: 47.5, str: "0.21", finalScore: "RICE 12 - ECU 28", result: "win" },
  { date: "2026-10-17", matchup: "Florida Gators @ Texas Longhorns", favorite: "Texas Longhorns", spread: "-13.5", total: 52, str: "0.25", finalScore: "FLA 27 - TEX 24", result: "win" },
  { date: "2026-10-17", matchup: "Notre Dame Fighting Irish @ BYU Cougars", favorite: "Notre Dame Fighting Irish", spread: "-10.5", total: 47, str: "0.22", finalScore: "ND 24 - BYU 28", result: "loss" },
];

const windGames = [
  { date: "2026-09-13", matchup: "Miami Dolphins @ Las Vegas Raiders", wind: "19 mph", total: 40.5, finalScore: "MIA 13 - LV 27", result: "win" },
  { date: "2026-10-11", matchup: "Indianapolis Colts @ Pittsburgh Steelers", wind: "19 mph", total: 43.5, finalScore: "IND 22 - PIT 34", result: "loss" },
];

export const bettingModels = {
  collegeFootball: {
    name: "Shaun's College Blowout Model",
    introducedEpisode: "S4E2",
    rule: "Take the OVER when a team is favored by 24.5+ points and the total is under 55.5, the closer to 50 the better. About a 60% historical hit rate over roughly the last 10 college football seasons.",
    record: { wins: 34, losses: 23 },
    pending: 0,
    lastUpdated: "2026-10-19",
    games: collegeFootballGames,
  },
  collegeUnder: {
    name: "Shaun's College Under Model",
    introducedEpisode: "S4E7",
    rule: "Take the UNDER when the favorite is laid between -7.5 and -14 and the spread-to-total ratio (spread divided by total) is between 0.20 and 0.25. Favorites in the -7.5 to -14 band have gone under about 61% of the time this season, and a ratio of 0.20-0.25 has been the sweet spot within it.",
    trackingNote: "Applied back to the start of the season (through October 17). Spreads and totals come from sportsbook lines that vary by a point or two between books, so a game right on the edge of the 0.20-0.25 band can shift.",
    record: { wins: 18, losses: 15 },
    pending: 0,
    lastUpdated: "2026-10-19",
    games: collegeUnderGames,
  },
  nfl: {
    name: "Dennis's NFL Road Dog Model",
    introducedEpisode: "S4E4",
    lastUpdated: "2026-10-19",
    tiers: [
      {
        key: "tier-1",
        label: "Tier 1 — Playable",
        rule: "Road underdog ATS when the total is 49 or higher. 57.1% hit rate, +9.9% ROI on 373 bets (~34/season) from 2015-2025, with both the 2015-20 and 2021-25 halves holding up on their own.",
        record: { wins: 5, losses: 4, pushes: 1 },
        pending: 0,
        games: nflTier1Games,
      },
      {
        key: "tier-2a",
        label: "Tier 2a — Diluted",
        rule: "Road underdog ATS when the total is 48 or higher. 55.6% hit rate, +6.8% ROI on 516 bets, about 40% more volume than Tier 1 for a 1.5-point weaker edge.",
        record: { wins: 8, losses: 4, pushes: 1 },
        pending: 0,
        games: nflTier2aGames,
      },
      {
        key: "tier-2b",
        label: "Tier 2b — Diluted",
        rule: "Any road team ATS when the total is 48 or higher (adds road favorites, who hit only 53.0% on their own). 54.7% hit rate, +4.8% ROI on 812 bets.",
        record: { wins: 11, losses: 7, pushes: 2 },
        pending: 0,
        games: nflTier2bGames,
      },
    ],
  },
  aaronWind: {
    name: "Aaron's Wind Model",
    introducedEpisode: "S4E5",
    rule: "Take the UNDER when wind is 15+ mph at kickoff. 56.8% hit rate going back 10 seasons. Graded using nflweather.com's sustained wind reading at each stadium.",
    record: { wins: 1, losses: 1 },
    pending: 0,
    lastUpdated: "2026-10-19",
    games: windGames,
  },
};
