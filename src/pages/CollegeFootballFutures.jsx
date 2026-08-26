import { Link } from "react-router-dom";
import { getShowBySlug } from "../data/shows";
import { collegeFootballFutures } from "../data/collegeFootballFutures";
import { usePageMeta } from "../hooks/usePageMeta";
import ResultBadge from "../components/ResultBadge";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

// Reuses the same headshots from the About page.
const HOST_PHOTOS = {
  Dennis: "/dennis-tresca.png",
  Shaun: "/shaun-thompson.jpg",
  Aaron: "/aaron-patterson.png",
};

function HostFutures({ host, picks, categories, accentColor }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        {HOST_PHOTOS[host] && (
          <img
            src={HOST_PHOTOS[host]}
            alt={host}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        )}
        <h3 className="text-lg font-bold text-neutral-900">{host}</h3>
      </div>

      <ul className="mt-4 space-y-4">
        {categories.map(({ key, label }) => {
          const pick = picks[key];
          if (!pick) return null;
          return (
            <li key={key} className="border-t border-neutral-100 pt-4 first:border-t-0 first:pt-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-lg font-bold" style={{ color: accentColor }}>
                  {pick.team}
                  {pick.odds ? <span className="ml-2 text-neutral-500">({pick.odds})</span> : null}
                </p>
                <ResultBadge result={pick.result} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function CollegeFootballFutures() {
  const show = getShowBySlug("dancing-with-the-odds");
  const formattedDate = formatter.format(new Date(collegeFootballFutures.recordedDate));
  usePageMeta(
    "College Football Futures",
    `Dancing With the Odds' ${collegeFootballFutures.season} college football futures picks from Dennis, Shaun, and Aaron: Power 4 conference champions and national champion.`
  );

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
            Dancing With the Odds
          </p>
          <h1 className="mt-1 text-3xl font-black sm:text-4xl md:text-5xl">College Football Futures</h1>
          <p className="mt-3 text-lg font-medium text-white/90">
            {collegeFootballFutures.season} season picks, made <time dateTime={collegeFootballFutures.recordedDate}>{formattedDate}</time>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {Object.entries(collegeFootballFutures.picks).map(([host, picks]) => (
            <HostFutures
              key={host}
              host={host}
              picks={picks}
              categories={collegeFootballFutures.categories}
              accentColor={show.colorTheme.primary}
            />
          ))}
        </div>
      </section>
    </>
  );
}
