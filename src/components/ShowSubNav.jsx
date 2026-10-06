import { Link, useLocation } from "react-router-dom";

// The show's sub-page links (Road to $10K, Daily Picks, ...), driven by
// `subPages` in src/data/shows.js. Shown on the show page and every one of
// its sub-pages; the page you're on is highlighted.
export default function ShowSubNav({ show, className = "" }) {
  const { pathname } = useLocation();

  if (!show.subPages || show.subPages.length === 0) return null;

  return (
    <nav aria-label={`${show.name} pages`} className={`flex flex-wrap gap-3 ${className}`}>
      {show.subPages.map((subPage) => {
        const active = pathname === subPage.path || pathname.startsWith(`${subPage.path}/`);
        return (
          <Link
            key={subPage.path}
            to={subPage.path}
            aria-current={active ? "page" : undefined}
            className={`inline-flex w-fit items-center gap-1 rounded-full px-5 py-2 text-sm font-semibold transition-transform hover:scale-105 ${
              active ? "bg-white/20 text-white ring-2 ring-white" : "bg-white"
            }`}
            style={active ? undefined : { color: show.colorTheme.primary }}
          >
            {subPage.label}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        );
      })}
    </nav>
  );
}
