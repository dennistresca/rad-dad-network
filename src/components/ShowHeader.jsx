import PlatformLinks from "./PlatformLinks";

export default function ShowHeader({ show }) {
  const { colorTheme } = show;

  return (
    <section
      className="text-white"
      style={{ background: colorTheme.gradient }}
      aria-labelledby="show-title"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center lg:px-8">
        <img
          src={show.logo}
          alt={`${show.name} logo`}
          className="h-32 w-32 shrink-0 rounded-2xl object-cover shadow-lg"
        />

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
            {show.category}
          </p>
          <h1 id="show-title" className="mt-1 text-3xl font-black sm:text-4xl md:text-5xl">
            {show.name}
          </h1>
          <p className="mt-2 text-lg font-medium text-white/90">{show.tagline}</p>
          <p className="mt-4 max-w-2xl text-white/90">{show.description}</p>
          <p className="mt-3 text-sm font-semibold text-white/80">
            Hosted by {show.hostGroupName}
            {show.season ? ` · ${show.season}` : ""}
          </p>
          <PlatformLinks platforms={show.platforms} className="mt-6" />
        </div>
      </div>
    </section>
  );
}
