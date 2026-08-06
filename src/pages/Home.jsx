import { Link } from "react-router-dom";
import { shows } from "../data/shows";
import { useLatestNetworkEpisode } from "../hooks/useEpisodes";
import ShowCard from "../components/ShowCard";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

function LatestEpisodeHero() {
  const { latest, error, loading } = useLatestNetworkEpisode(shows);

  if (loading) {
    return (
      <div className="animate-pulse" aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading latest episode…</span>
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="mt-4 h-10 w-full max-w-2xl rounded bg-white/10" />
        <div className="mt-4 h-5 w-full max-w-xl rounded bg-white/10" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="max-w-2xl text-neutral-300">
        Couldn't load the latest episode right now. Check out our shows below.
      </p>
    );
  }

  return (
    <>
      <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
        {latest.title}
      </h1>
      <p className="mt-4 max-w-2xl text-neutral-300">{latest.description}</p>
      <p className="mt-2 text-sm text-neutral-400">
        From <span className="font-semibold text-white">{latest.show.name}</span> ·{" "}
        <time dateTime={latest.date}>{formatter.format(new Date(latest.date))}</time>
      </p>
      <Link
        to={`/shows/${latest.show.slug}`}
        className="mt-8 inline-flex w-fit rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
      >
        Listen Now
      </Link>
    </>
  );
}

export default function Home() {
  return (
    <>
      <section className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
            Latest Episode
          </p>
          <LatestEpisodeHero />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
          Great conversations. Zero pretentiousness.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
          Rad Dad Network is home to a growing family of podcasts made by people who genuinely
          like hanging out and talking about the stuff they're obsessed with: sports betting,
          Formula 1, veteran life, and whatever comes next. Smart content that doesn't take
          itself too seriously.
        </p>
      </section>

      <section className="bg-neutral-100 py-16" aria-labelledby="shows-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="shows-heading" className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Our Shows
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shows.map((show) => (
              <ShowCard key={show.slug} show={show} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-500 py-16 text-white" aria-labelledby="pitch-heading">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 id="pitch-heading" className="text-2xl font-bold sm:text-3xl">
            Got a show idea? Join the Network.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            We're actively recruiting new podcast creators and hosts. If you've got a voice,
            a niche you love, and the drive to put out great episodes, we want to hear from you.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded-full bg-neutral-950 px-6 py-3 font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            Pitch a Show
          </Link>
        </div>
      </section>
    </>
  );
}
