const PLATFORM_LABELS = {
  apple: "Apple Podcasts",
  spotify: "Spotify",
  youtube: "YouTube",
  rss: "RSS",
};

// Renders "Listen on ..." buttons for whichever platforms a show defines.
// TODO: each href is a placeholder ("#") until real platform links are supplied.
export default function PlatformLinks({ platforms, className = "" }) {
  const entries = Object.entries(platforms).filter(([, href]) => href);

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {entries.map(([key, href]) => (
        <a
          key={key}
          href={href}
          className="rounded-full border border-current px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10"
        >
          Listen on {PLATFORM_LABELS[key] ?? key}
        </a>
      ))}
    </div>
  );
}
