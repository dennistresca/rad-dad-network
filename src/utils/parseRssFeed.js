// Parses a podcast RSS feed (as fetched directly in the browser) into a
// plain list of episodes. Anchor/Spotify-for-Podcasters feeds send an
// Access-Control-Allow-Origin: * header, so this can run client-side with
// no build-time step or proxy.

// Some feeds double-encode entities (e.g. a literal "&#39;" left over after
// an already-escaped description gets XML-decoded once). A <textarea> only
// ever treats its content as text, never markup, so this is a safe way to
// get the browser's own HTML-entity decoding without an XSS risk.
function decodeEntities(text) {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

function stripHtml(html) {
  return decodeEntities(String(html ?? "").replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function toIsoDate(pubDate) {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export function parseFeedEpisodes(xmlText, maxCount = 4) {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");

  if (doc.querySelector("parsererror")) {
    throw new Error("Failed to parse RSS feed XML");
  }

  const items = Array.from(doc.querySelectorAll("item"));

  return items
    .map((item) => {
      const enclosure = item.querySelector("enclosure");
      return {
        title: stripHtml(item.querySelector("title")?.textContent),
        description: truncate(stripHtml(item.querySelector("description")?.textContent), 220),
        date: toIsoDate(item.querySelector("pubDate")?.textContent),
        link: item.querySelector("link")?.textContent?.trim() || "#",
        audioUrl: enclosure?.getAttribute("url") || null,
        audioType: enclosure?.getAttribute("type") || "audio/mpeg",
      };
    })
    .filter((episode) => episode.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, maxCount);
}

export async function fetchFeedEpisodes(feedUrl, maxCount = 4) {
  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const xml = await response.text();
  return parseFeedEpisodes(xml, maxCount);
}
