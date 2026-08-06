import { Link } from "react-router-dom";

export default function ShowCard({ show }) {
  const { colorTheme } = show;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={show.logo}
          alt={`${show.name} logo`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {show.category}
        </p>
        <h3 className="mt-1 text-xl font-bold text-neutral-900">{show.name}</h3>
        <p className="mt-2 flex-1 text-sm text-neutral-600">{show.tagline}</p>

        <Link
          to={`/shows/${show.slug}`}
          className="mt-4 inline-flex w-fit items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
          style={{ backgroundColor: colorTheme.primary }}
        >
          Listen Now
        </Link>
      </div>
    </article>
  );
}
