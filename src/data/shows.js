// Shared show data. Add a new show by pushing another object into this array —
// pages and components read from here, so no other file needs to change.
//
// Episode data is NOT stored here — it's fetched live in the browser from
// each show's `feedUrl` (see src/hooks/useEpisodes.js), since Spotify for
// Podcasters' RSS feeds send an Access-Control-Allow-Origin: * header. That
// means episodes are always current with no build/rebuild step.

export const shows = [
  {
    id: "dancing-with-the-odds",
    slug: "dancing-with-the-odds",
    name: "Dancing With the Odds",
    shortName: "Dancing With the Odds",
    category: "Sports Betting",
    hosts: ["Dennis", "Shaun", "Aaron"],
    hostGroupName: "The Prop Dads",
    tagline: "Chasing $10K, one bad beat at a time.",
    description:
      "A sports betting podcast where three friends nicknamed \"the Prop Dads\" try to grow their bankroll to $10K by betting moneylines, spreads, and player props across football season. They share their hits, misses, and lessons learned in a real, unfiltered way — for seasoned sharps and rookie bettors alike.",
    cadence: "Weekly episodes during NFL/college football season",
    season: "Currently in Season 3",
    colorTheme: {
      primary: "#DC2626", // red-600
      primaryDark: "#7F1D1D", // red-900
      secondary: "#000000",
      accent: "#FFFFFF",
      gradient: "linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)",
    },
    logo: "/logo-dancing-with-the-odds.png",
    feedUrl: "https://anchor.fm/s/11112b5f8/podcast/rss",
    platforms: {
      apple: "https://podcasts.apple.com/us/podcast/dancing-with-the-odds/id1737245810",
      spotify: "https://open.spotify.com/show/0L1J1ibh9WR7rYLYMgF7CK",
      youtube: "https://www.youtube.com/@DWTOPod",
    },
  },
  {
    id: "stateside-speed",
    slug: "stateside-speed",
    name: "Stateside Speed",
    shortName: "Stateside Speed",
    category: "Formula 1 / Motorsport",
    hosts: ["Dennis Tresca (recurring writer/host)"],
    hostGroupName: "Team Stateside",
    tagline: "F1, translated for the American paddock.",
    description:
      "The ultimate F1 podcast hosted by passionate American fans who live and breathe Formula 1. Race recaps, strategy breakdowns, paddock drama, and a uniquely American perspective on open-wheel racing — with witty banter throughout and occasional IndyCar coverage.",
    cadence: "Race-week episodes throughout the F1 season",
    season: null,
    colorTheme: {
      primary: "#2563EB", // blue-600 — STATESIDE
      primaryDark: "#000000",
      secondary: "#DC2626", // red — SPEED
      accent: "#FFFFFF",
      gradient: "linear-gradient(135deg, #000000 0%, #111827 60%, #2563EB 100%)",
    },
    logo: "/logo-stateside-speed.jpg",
    feedUrl: "https://anchor.fm/s/f1c8df9c/podcast/rss",
    platforms: {
      apple: "https://podcasts.apple.com/us/podcast/stateside-speed/id1733500660",
      spotify: "https://open.spotify.com/show/0NTafHbcBXexka0eibCL9u",
      youtube: "https://www.youtube.com/@StatesideSpeedPodcast",
    },
  },
  {
    id: "check-six-radio",
    slug: "check-six-radio",
    name: "Check-Six Radio",
    shortName: "Check-Six Radio",
    category: "Military Veteran Resources",
    hosts: ["Dennis Tresca"],
    hostGroupName: "Dennis Tresca, USAF (Ret.)",
    tagline: "Mission briefings for life after the uniform.",
    description:
      "Actionable intel on the benefits, businesses, and community support available to military veterans and their families. Hosted by an 18-year Air Force veteran, Check-Six Radio delivers \"mission briefings\" on topics like the GI Bill, VA benefits, and translating military leadership skills into civilian careers.",
    cadence: "New mission briefings released regularly",
    season: null,
    colorTheme: {
      primary: "#B91C1C", // red-700
      primaryDark: "#1E3A8A", // blue-900
      secondary: "#FFFFFF",
      accent: "#1E3A8A",
      gradient: "linear-gradient(135deg, #1E3A8A 0%, #1E293B 50%, #B91C1C 100%)",
    },
    logo: "/logo-check-six-radio.jpg",
    feedUrl: "https://anchor.fm/s/10e095754/podcast/rss",
    platforms: {
      apple: "https://podcasts.apple.com/us/podcast/check-six-radio/id1884719923",
      spotify: "https://open.spotify.com/show/7geitK9NBdanPrkQZoLx4Q",
      youtube: "https://www.youtube.com/@Check-SixRadio",
    },
  },
];

export function getShowBySlug(slug) {
  return shows.find((show) => show.slug === slug);
}
