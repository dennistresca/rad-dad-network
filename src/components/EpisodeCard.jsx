const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default function EpisodeCard({ episode, accentColor = "#F97316" }) {
  const formattedDate = formatter.format(new Date(episode.date));

  return (
    <article className="flex flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <time dateTime={episode.date} className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {formattedDate}
      </time>
      <h3 className="mt-2 text-lg font-bold text-neutral-900">{episode.title}</h3>
      <p className="mt-2 flex-1 text-sm text-neutral-600">{episode.description}</p>
      {/* Links to the episode's page on Spotify for Podcasters, from the live RSS feed */}
      <a
        href={episode.link ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold"
        style={{ color: accentColor }}
      >
        Listen now
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </article>
  );
}
