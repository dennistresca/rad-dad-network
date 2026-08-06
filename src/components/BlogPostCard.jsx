import { useState } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default function BlogPostCard({ post, accentColor = "#F97316" }) {
  const [expanded, setExpanded] = useState(false);
  const formattedDate = formatter.format(new Date(post.date));

  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <time dateTime={post.date} className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {formattedDate}
        {post.author ? ` · ${post.author}` : ""}
      </time>
      <h3 className="mt-2 text-xl font-bold text-neutral-900">{post.title}</h3>

      {!expanded && <p className="mt-3 text-neutral-600">{post.excerpt}</p>}

      {expanded && (
        <div className="mt-3 space-y-4 text-neutral-700">
          {post.paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
        style={{ color: accentColor }}
        aria-expanded={expanded}
      >
        {expanded ? "Show less" : "Read full post"}
        <svg
          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </article>
  );
}
