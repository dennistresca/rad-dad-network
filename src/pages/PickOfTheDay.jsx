import { Link } from "react-router-dom";
import { getShowBySlug } from "../data/shows";
import { pickOfTheDay } from "../data/pickOfTheDay";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

function HostPicks({ host, picks, record, accentColor }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-neutral-900">
        {host}
        {record && (
          <span className="ml-2 text-sm font-medium text-neutral-500">
            (POTD Record {record.wins}-{record.losses})
          </span>
        )}
      </h3>

      {picks.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-500">No pick submitted yet.</p>
      ) : (
        <ul className="mt-3 space-y-4">
          {picks.map((pick, i) => (
            <li key={i} className="border-t border-neutral-100 pt-4 first:border-t-0 first:pt-0">
              {pick.game && (
                <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  {pick.game}
                </p>
              )}
              <p className="mt-1 text-lg font-bold" style={{ color: accentColor }}>
                {pick.selection}
                {pick.odds ? <span className="ml-2 text-neutral-500">({pick.odds})</span> : null}
              </p>
              {pick.note && <p className="mt-1 text-sm text-neutral-600">{pick.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PickOfTheDay() {
  const show = getShowBySlug("dancing-with-the-odds");
  const formattedDate = formatter.format(new Date(pickOfTheDay.date));

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
          <h1 className="mt-1 text-3xl font-black sm:text-4xl md:text-5xl">Pick of the Day</h1>
          <p className="mt-3 text-lg font-medium text-white/90">
            Updated <time dateTime={pickOfTheDay.date}>{formattedDate}</time>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {Object.entries(pickOfTheDay.picks).map(([host, picks]) => (
            <HostPicks
              key={host}
              host={host}
              picks={picks}
              record={pickOfTheDay.records?.[host]}
              accentColor={show.colorTheme.primary}
            />
          ))}
        </div>
      </section>
    </>
  );
}
