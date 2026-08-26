import { useState } from "react";
import { Link } from "react-router-dom";
import { getShowBySlug } from "../data/shows";
import { pickOfTheDay, previousDayPicks } from "../data/pickOfTheDay";
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

// Groups picks by league, one badge per group instead of one per pick.
// Preserves the order leagues first appear in.
function groupByLeague(picks) {
  const groups = [];
  for (const pick of picks) {
    const existing = groups.find(([league]) => league === pick.league);
    if (existing) {
      existing[1].push(pick);
    } else {
      groups.push([pick.league, [pick]]);
    }
  }
  return groups;
}

function HostPicks({ host, picks, leagueRecords, accentColor }) {
  const leagueEntries = leagueRecords
    ? Object.entries(leagueRecords).filter(([, r]) => r.wins + r.losses > 0)
    : [];
  const overall = leagueEntries.reduce(
    (acc, [, r]) => ({ wins: acc.wins + r.wins, losses: acc.losses + r.losses }),
    { wins: 0, losses: 0 }
  );

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
        <h3 className="text-lg font-bold text-neutral-900">
          {host}
          {leagueEntries.length > 0 && (
            <span className="ml-2 text-sm font-medium text-neutral-500">
              (Daily Picks Record {overall.wins}-{overall.losses})
            </span>
          )}
        </h3>
      </div>

      {leagueEntries.length > 0 && (
        <p className="mt-1 text-xs font-medium text-neutral-400">
          {leagueEntries.map(([league, r]) => `${league} ${r.wins}-${r.losses}`).join(" · ")}
        </p>
      )}

      {picks.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-500">No pick submitted yet.</p>
      ) : (
        <div className="mt-3 space-y-5">
          {groupByLeague(picks).map(([league, leaguePicks]) => (
            <div key={league}>
              {league && (
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-xs font-bold tracking-wide text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {league}
                </span>
              )}
              <ul className="mt-2 space-y-4">
                {leaguePicks.map((pick, i) => (
                  <li key={i} className="border-t border-neutral-100 pt-4 first:border-t-0 first:pt-0">
                    {pick.game && (
                      <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                        {pick.game}
                      </p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-lg font-bold" style={{ color: accentColor }}>
                        {pick.selection}
                        {pick.odds ? <span className="ml-2 text-neutral-500">({pick.odds})</span> : null}
                      </p>
                      <ResultBadge result={pick.result} />
                    </div>
                    {pick.note && <p className="mt-1 text-sm text-neutral-600">{pick.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PickOfTheDay() {
  const show = getShowBySlug("dancing-with-the-odds");
  const [view, setView] = useState("today");
  const isToday = view === "today";
  const activeData = isToday ? pickOfTheDay : previousDayPicks;
  const formattedDate = formatter.format(new Date(activeData.date));
  usePageMeta(
    "Daily Picks",
    `Dancing With the Odds' daily picks from Dennis, Shaun, and Aaron, updated ${formattedDate}.`
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
          <h1 className="mt-1 text-3xl font-black sm:text-4xl md:text-5xl">Daily Picks</h1>
          <p className="mt-3 text-lg font-medium text-white/90">
            {isToday ? "Updated" : "Showing"} <time dateTime={activeData.date}>{formattedDate}</time>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setView("today")}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            style={
              isToday
                ? { backgroundColor: show.colorTheme.primary, color: "white" }
                : { backgroundColor: "#f5f5f5", color: "#525252" }
            }
          >
            Today's Picks
          </button>
          <button
            type="button"
            onClick={() => setView("yesterday")}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            style={
              !isToday
                ? { backgroundColor: show.colorTheme.primary, color: "white" }
                : { backgroundColor: "#f5f5f5", color: "#525252" }
            }
          >
            Yesterday's Picks
          </button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {Object.entries(activeData.picks).map(([host, picks]) => (
            <HostPicks
              key={host}
              host={host}
              picks={picks}
              leagueRecords={isToday ? pickOfTheDay.records?.[host] : null}
              accentColor={show.colorTheme.primary}
            />
          ))}
        </div>
      </section>
    </>
  );
}
