import { Link } from "react-router-dom";
import { getShowBySlug } from "../data/shows";
import { bettingModels } from "../data/bettingModels";
import { usePageMeta } from "../hooks/usePageMeta";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

function ModelCard({ model, accentColor }) {
  const { wins, losses } = model.record;
  const decided = wins + losses;
  const winPct = decided > 0 ? Math.round((wins / decided) * 100) : null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-2xl font-bold text-neutral-900">{model.name}</h2>
      <p className="mt-1 text-sm text-neutral-500">Introduced on {model.introducedEpisode}</p>

      <p className="mt-6 text-6xl font-black" style={{ color: accentColor }}>
        {wins}-{losses}
      </p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {winPct !== null ? `${winPct}% this season` : "No games decided yet"}
        {model.pending > 0 && ` · ${model.pending} pending`}
      </p>

      <p className="mt-6 text-left text-neutral-700">{model.rule}</p>

      <p className="mt-6 text-xs text-neutral-400">
        Every qualifying game this season counts here, whether or not the guys actually bet on
        it. Updated {formatter.format(new Date(model.lastUpdated))}.
      </p>
    </div>
  );
}

export default function ModelTracker() {
  const show = getShowBySlug("dancing-with-the-odds");
  usePageMeta(
    "Model Tracker",
    "Tracking the season-long results of Dancing With the Odds' two statistical betting models: Shaun's college football blowout model and Dennis's NFL road dog model."
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
          <h1 className="mt-1 text-3xl font-black sm:text-4xl md:text-5xl">Model Tracker</h1>
          <p className="mt-3 text-lg font-medium text-white/90">
            How the two data-driven models the guys introduced this season are actually doing,
            across every qualifying game.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <ModelCard model={bettingModels.collegeFootball} accentColor={show.colorTheme.primary} />
          <ModelCard model={bettingModels.nfl} accentColor={show.colorTheme.primary} />
        </div>
      </section>
    </>
  );
}
