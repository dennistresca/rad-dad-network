// Green check / red X for a graded win/loss bet. Shared by the Daily
// Picks and Road to $10K pages. Renders nothing while a bet is pending
// (no `result` set yet).
export default function ResultBadge({ result }) {
  if (result === "win") {
    return (
      <svg
        className="h-5 w-5 shrink-0 text-green-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-label="Graded: win"
      >
        <title>Graded: win</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    );
  }

  if (result === "loss") {
    return (
      <svg
        className="h-5 w-5 shrink-0 text-red-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-label="Graded: loss"
      >
        <title>Graded: loss</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }

  return null;
}
