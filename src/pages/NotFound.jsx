import { Link } from "react-router-dom";
import { shows } from "../data/shows";
import { usePageMeta } from "../hooks/usePageMeta";

export default function NotFound() {
  usePageMeta("Page Not Found", null, { noindex: true });

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-black text-neutral-900">Page Not Found</h1>
      <p className="mt-4 text-lg text-neutral-600">
        Looks like this episode got lost in the feed. Let's get you back home.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
      >
        Back to Home
      </Link>

      <nav aria-label="Our shows" className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Or jump to a show</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-3">
          {shows.map((show) => (
            <li key={show.slug}>
              <Link
                to={`/shows/${show.slug}`}
                className="inline-flex rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-900"
              >
                {show.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
