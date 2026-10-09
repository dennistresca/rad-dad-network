// Small white DWTO logo shown above the title in the hero of each Dancing
// With the Odds sub-page (Road to $10K, Daily Picks, futures, Model Tracker).
// Replaces the plain "Dancing With the Odds" text label; the alt text keeps
// the show name readable for screen readers and search engines.
export default function DwtoHeaderLogo() {
  return (
    <img
      src="/brand/dwto-horizontal-white.svg"
      alt="Dancing With the Odds"
      className="mt-4 h-12 w-auto"
    />
  );
}
