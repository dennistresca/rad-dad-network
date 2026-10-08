import { SITE_URL } from "../config/site";

// Hosts whose episode pages no longer exist (Spotify for Podcasters / Anchor
// were retired, so old feed <link> values there show an empty page).
const DEAD_HOSTS = ["podcasters.spotify.com", "creators.spotify.com", "anchor.fm"];

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function normalize(url) {
  return url.replace(/\/+$/, "").toLowerCase();
}

// Picks where an episode card's "Listen to this episode" link should go.
// Uses the episode's own feed link when it's useful; otherwise falls back to
// the show's Apple Podcasts page, then its Spotify page. YouTube links (and
// any other working link) are kept as they are.
export function resolveEpisodeLink(episode, show) {
  const link = episode.link;
  const host = link ? hostOf(link) : null;

  const isDead = host && DEAD_HOSTS.some((dead) => host === dead || host.endsWith(`.${dead}`));
  const showPageUrls = [
    `${SITE_URL}/shows/${show.slug}`,
    `https://raddadnetwork.com/shows/${show.slug}`,
  ].map(normalize);
  const isShowPage = link && showPageUrls.includes(normalize(link));

  if (!host || isDead || isShowPage) {
    return show.platforms.apple || show.platforms.spotify;
  }
  return link;
}
