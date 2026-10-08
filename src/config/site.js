// The one canonical address for the site. The bare raddadnetwork.com
// permanently redirects to www, so every absolute URL we publish (canonical
// tags, og:url, JSON-LD, sitemap) uses www. Fixed rather than
// window.location.origin because the build prerenders pages from
// localhost:4173 and that origin must never get baked into saved HTML.
export const SITE_URL = "https://www.raddadnetwork.com";
