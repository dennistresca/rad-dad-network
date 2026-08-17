import { Link } from "react-router-dom";
import PlatformLinks from "./PlatformLinks";
import SocialLinks from "./SocialLinks";

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

          {show.subPages && show.subPages.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {show.subPages.map((subPage) => (
                <Link
                  key={subPage.path}
                  to={subPage.path}
                  className="inline-flex w-fit items-center gap-1 rounded-full bg-white px-5 py-2 text-sm font-semibold transition-transform hover:scale-105"
                  style={{ color: colorTheme.primary }}
                >
                  {subPage.label}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              ))}
            </div>
          )}

          {show.social && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Follow {show.shortName}
              </p>
              <SocialLinks social={show.social} className="mt-3" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
