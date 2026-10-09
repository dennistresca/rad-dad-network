import { Link, useParams } from "react-router-dom";
import { getShowBySlug } from "../data/shows";
import { bettingModels } from "../data/bettingModels";
import { usePageMeta } from "../hooks/usePageMeta";
import ResultBadge from "../components/ResultBadge";
import ShowSubNav from "../components/ShowSubNav";
import DwtoHeaderLogo from "../components/DwtoHeaderLogo";

const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

// Resolves which model (or NFL tier) a URL is asking for. Returns
// { name, rule, games, backLabel } or null if the model/tier doesn't exist.
function resolveModel(model, tierKey) {
  if (model === "college-football") {
    return { ...bettingModels.collegeFootball, isTier: false };
  }
  if (model === "wind") {
    return { ...bettingModels.aaronWind, isTier: false };
  }
  if (model === "nfl") {
    const tier = bettingModels.nfl.tiers.find((t) => t.key === tierKey);
    if (!tier) return null;
    return { ...tier, name: `${bettingModels.nfl.name}: ${tier.label}`, isTier: true };
  }
  return null;
}

function GameRow({ game, accentColor, isNfl }) {
  return (
    <li className="border-t border-neutral-100 py-4 first:border-t-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {game.matchup}
          <span className="ml-2 normal-case text-neutral-400">
            ({formatter.format(new Date(game.date))})
          </span>
        </p>
        <ResultBadge result={game.result === "push" ? undefined : game.result} />
        {game.result === "push" && (
          <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-neutral-600">
            Push
          </span>
        )}
      </div>
      <p className="mt-1 text-lg font-bold" style={{ color: accentColor }}>
        {game.wind
          ? "UNDER"
          : isNfl
          ? `${game.roadTeam} ${game.spread}`
          : `${game.favorite} ${game.spread}`}
        {game.wind ? (
          <span className="ml-2 text-neutral-500">(Wind {game.wind}, Total {game.total})</span>
        ) : (
          <span className="ml-2 text-neutral-500">(Total {game.total})</span>
        )}
      </p>
      <p className="mt-1 text-sm text-neutral-500">Final: {game.finalScore}</p>
    </li>
  );
}

export default function ModelGames() {
  const { model, tier } = useParams();
  const show = getShowBySlug("dancing-with-the-odds");
  const resolved = resolveModel(model, tier);

  usePageMeta(
    resolved ? resolved.name : "Model Tracker",
    resolved
      ? `Every game this season that fits ${resolved.name}, with the line and final score.`
      : "Model not found."
  );

  if (!resolved) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-neutral-600">That model couldn't be found.</p>
        <Link
          to="/shows/dancing-with-the-odds/model-tracker"
          className="mt-4 inline-block font-semibold text-neutral-900 hover:underline"
        >
          ← Back to Model Tracker
        </Link>
      </section>
    );
  }

  const isNfl = model === "nfl";
  const { wins, losses, pushes = 0 } = resolved.record;
  const recordLabel = pushes > 0 ? `${wins}-${losses}-${pushes}` : `${wins}-${losses}`;

  return (
    <>
      <section className="text-white" style={{ background: show.colorTheme.gradient }}>
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            to="/shows/dancing-with-the-odds/model-tracker"
            className="text-sm font-semibold text-white/80 hover:text-white hover:underline"
          >
            ← Back to Model Tracker
          </Link>
          <DwtoHeaderLogo />
          <h1 className="mt-1 text-3xl font-black sm:text-4xl">{resolved.name}</h1>
          <p className="mt-3 text-lg font-medium text-white/90">{resolved.rule}</p>
          <p className="mt-4 text-2xl font-black">
            {recordLabel}
            {resolved.pending > 0 && (
              <span className="ml-2 text-base font-semibold text-white/80">
                &middot; {resolved.pending} pending
              </span>
            )}
          </p>
          <ShowSubNav show={show} className="mt-6" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {resolved.games.length === 0 ? (
          <p className="text-neutral-500">No qualifying games yet this season.</p>
        ) : (
          <ul className="rounded-2xl border border-neutral-200 bg-white px-6 shadow-sm">
            {resolved.games.map((game, i) => (
              <GameRow key={i} game={game} accentColor={show.colorTheme.primary} isNfl={isNfl} />
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
