import { useEffect } from "react";

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

// Sets the document title and meta description for the current page.
// Client-side only: this updates the DOM after the page mounts, so it
// helps the browser tab, JS-executing crawlers (Google), and anyone
// navigating within the app. It does NOT help link-preview scrapers that
// don't run JavaScript (e.g. some social platforms), since Vercel serves
// the same static index.html for every route.
export function usePageMeta(title, description) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    if (description) {
      setMetaTag("description", description);
      setMetaProperty("og:title", fullTitle);
      setMetaProperty("og:description", description);
    }
  }, [title, description]);
}
