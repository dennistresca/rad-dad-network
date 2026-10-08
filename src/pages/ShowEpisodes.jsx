import { Link, useParams } from "react-router-dom";
import { getShowBySlug } from "../data/shows";
import { useShowEpisodes } from "../hooks/useEpisodes";
import { usePageMeta } from "../hooks/usePageMeta";
import EpisodeCard from "../components/EpisodeCard";
import NotFound from "./NotFound";

function EpisodeCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-neutral-200 bg-white p-5">
      <div className="h-3 w-24 rounded bg-neutral-200" />
      <div className="mt-3 h-5 w-3/4 rounded bg-neutral-200" />
      <div className="mt-3 h-4 w-full rounded bg-neutral-200" />
      <div className="mt-2 h-4 w-2/3 rounded bg-neutral-200" />
    </div>
  );
}

// Every episode in a show's feed, newest first. The show page only shows
// the latest few, so this is how older episodes stay reachable.
export default function ShowEpisodes() {
  const { slug } = useParams();
  const show = getShowBySlug(slug);
  const { episodes, error, loading } = useShowEpisodes(show?.feedUrl, Infinity);
  usePageMeta(
    show ? `All Episodes of ${show.name}` : "Page Not Found",
    show ? `Every episode of ${show.name}, newest first.` : null,
    { noindex: !show }
  );

  if (!show) {
    return <NotFound />;
  }

  return (
    <>
      <section className="text-white" style={{ background: show.colorTheme.gradient }}>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            to={`/shows/${show.slug}`}
            className="text-sm font-semibold text-white/80 hover:text-white hover:underline"
          >
            ← Back to {show.name}
          </Link>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-white/80">
            {show.name}
          </p>
          <h1 className="mt-1 text-3xl font-black sm:text-4xl md:text-5xl">All Episodes</h1>
          {episodes && episodes.length > 0 && (
            <p className="mt-3 text-lg font-medium text-white/90">
              {episodes.length} {episodes.length === 1 ? "episode" : "episodes"}, newest first
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {show.onBreak && (
          <p
            role="status"
            className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900"
          >
            {show.breakMessage}
          </p>
        )}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
            <span className="sr-only">Loading episodes…</span>
            {Array.from({ length: 6 }).map((_, i) => (
              <EpisodeCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-neutral-600">
            We couldn't load episodes right now. In the meantime, catch up on{" "}
            <a href={show.platforms.spotify} className="font-semibold underline">
              Spotify
            </a>
            .
          </p>
        )}

        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.guid ?? episode.link}
                episode={episode}
                show={show}
                accentColor={show.colorTheme.primary}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
