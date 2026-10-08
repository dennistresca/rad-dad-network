import { useEffect } from "react";
import { SITE_URL } from "../config/site";

const SITE_NAME = "Rad Dad Network";

function setMetaTag(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setMetaProperty(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href) {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

// Sets the document title and meta description for the current page.
// Client-side only: this updates the DOM after the page mounts, so it
// helps the browser tab, JS-executing crawlers (Google), and anyone
// navigating within the app. It does NOT help link-preview scrapers that
// don't run JavaScript (e.g. some social platforms), since Vercel serves
// the same static index.html for every route.
export function usePageMeta(title, description, { noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;
    setCanonical(`${SITE_URL}${window.location.pathname}`);
    setMetaProperty("og:url", `${SITE_URL}${window.location.pathname}`);
    setMetaTag("robots", noindex ? "noindex, nofollow" : "index, follow");

    if (description) {
      setMetaTag("description", description);
      setMetaProperty("og:title", fullTitle);
      setMetaProperty("og:description", description);
    }
  }, [title, description, noindex]);
}

// Injects (or updates) a <script type="application/ld+json"> structured
// data block, keyed by `id` so a page can safely call this more than once
// without piling up duplicate tags, and it cleans itself up on unmount so
// the wrong schema doesn't leak into whatever page loads next. Same
// client-side-only caveat as usePageMeta above: helps JS-executing
// crawlers (Google) today; only reaches non-JS bots once prerendering
// actually works.
export function useStructuredData(id, data) {
  useEffect(() => {
    if (!data) return undefined;

    let tag = document.getElementById(id);
    if (!tag) {
      tag = document.createElement("script");
      tag.type = "application/ld+json";
      tag.id = id;
      document.head.appendChild(tag);
    }
    tag.textContent = JSON.stringify(data);

    return () => {
      tag?.remove();
    };
  }, [id, data]);
}
