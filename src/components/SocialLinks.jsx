const PLATFORM_LABELS = {
  facebook: "Facebook",
  tiktok: "TikTok",
};

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3c-.27-.04-1.2-.12-2.28-.12-2.25 0-3.8 1.37-3.8 3.9V10.5H8v3h2.42V21h3.08z" />
    </svg>
  );
}

function TikTokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.5 3c.4 2.2 1.9 3.9 4.5 4.1v2.9c-1.6.1-3-.4-4.5-1.4v6.8c0 3.4-2.5 5.9-5.7 5.9-3.2 0-5.7-2.5-5.7-5.7 0-3.3 2.7-5.8 6-5.7v3c-1.5-.2-2.9.9-2.9 2.6 0 1.5 1.2 2.7 2.7 2.7 1.6 0 2.9-1.3 2.9-3.1V3h2.7z" />
    </svg>
  );
}

const ICONS = {
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
};

// Renders circular icon buttons for whichever social platforms a show
// defines. Distinct from PlatformLinks (which are "listen to the podcast"
// buttons) — these are "follow us" social profiles.
export default function SocialLinks({ social, className = "" }) {
  if (!social) return null;
  const entries = Object.entries(social).filter(([, href]) => href);
  if (entries.length === 0) return null;

  return (
    <div className={`flex gap-3 ${className}`}>
      {entries.map(([key, href]) => {
        const Icon = ICONS[key];
        const label = PLATFORM_LABELS[key] ?? key;
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow on ${label}`}
            title={label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-current transition-colors hover:bg-white/10"
          >
            {Icon ? <Icon className="h-5 w-5" /> : label[0]}
          </a>
        );
      })}
    </div>
  );
}
