import { Navigate, useParams } from "react-router-dom";
import { getShowBySlug } from "../data/shows";
import { useShowEpisodes } from "../hooks/useEpisodes";
import ShowHeader from "../components/ShowHeader";
import EpisodeCard from "../components/EpisodeCard";

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

export default function ShowPage() {
  const { slug } = useParams();
  const show = getShowBySlug(slug);
  const { episodes, error, loading } = useShowEpisodes(show?.feedUrl);

  if (!show) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ShowHeader show={show} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="episodes-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="episodes-heading" className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Latest Episodes
          </h2>
          <p className="text-sm text-neutral-500">{show.cadence}</p>
        </div>

        {loading && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
            <span className="sr-only">Loading latest episodes…</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <EpisodeCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <p className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-neutral-600">
            We couldn't load episodes right now. In the meantime, catch up on{" "}
            <a href={show.platforms.spotify} className="font-semibold underline">
              Spotify
            </a>
            .
          </p>
        )}

        {!loading && !error && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.link} episode={episode} accentColor={show.colorTheme.primary} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
