import { Link } from "react-router-dom";
import { getShowBySlug } from "../data/shows";
import { bankrollTracker } from "../data/bankrollTracker";
import { usePageMeta } from "../hooks/usePageMeta";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function RecordCard({ label, record, accentColor }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-black" style={{ color: accentColor }}>
        {record.wins}-{record.losses}
      </p>
    </div>
  );
}

export default function BankrollTracker() {
  const show = getShowBySlug("dancing-with-the-odds");
  const formattedDate = formatter.format(new Date(bankrollTracker.lastUpdated));
  usePageMeta(
    "Road to $10K",
    `Dancing With the Odds' bankroll tracker: current bankroll and season betting record, updated ${formattedDate}.`
  );

  const { currentBankroll, goalBankroll, records } = bankrollTracker;
  const progressPercent = Math.min(100, Math.max(0, (currentBankroll / goalBankroll) * 100));

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
          <h1 className="mt-1 text-3xl font-black sm:text-4xl md:text-5xl">Road to $10K</h1>
          <p className="mt-3 text-lg font-medium text-white/90">
            Updated <time dateTime={bankrollTracker.lastUpdated}>{formattedDate}</time>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Current Bankroll
          </p>
          <p className="mt-2 text-5xl font-black" style={{ color: show.colorTheme.primary }}>
            {currencyFormatter.format(currentBankroll)}
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Goal: {currencyFormatter.format(goalBankroll)}
          </p>

          <div
            className="mx-auto mt-6 h-4 w-full max-w-xl overflow-hidden rounded-full bg-neutral-100"
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${Math.round(progressPercent)}% of the way to the $10K goal`}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progressPercent}%`, backgroundColor: show.colorTheme.primary }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-neutral-500">
            {progressPercent.toFixed(1)}% of the way there
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <RecordCard label="Season Record" record={records.overall} accentColor={show.colorTheme.primary} />
          <RecordCard
            label="College Football"
            record={records.collegeFootball}
            accentColor={show.colorTheme.primary}
          />
          <RecordCard label="NFL" record={records.nfl} accentColor={show.colorTheme.primary} />
          <RecordCard
            label="Buckets of Ca$h"
            record={records.bucketsOfCash}
            accentColor={show.colorTheme.primary}
          />
        </div>
      </section>
    </>
  );
}
