import { usePageMeta } from "../hooks/usePageMeta";

// TODO: replace placeholder bios with real ones once each co-founder sends theirs.
const founders = [
  {
    name: "Dennis Tresca",
    initials: "DT",
    photo: "/dennis-tresca.png",
    bio: [
      "Dennis is one of the founders of the Rad Dad Network and a recurring host across Dancing With the Odds, Stateside Speed, and Check-Six Radio. An Air Force retiree, he now spends his days as a veteran coach, fighting through red tape to help fellow vets get the benefits they've earned (the same driving force behind Check-Six Radio). A Sun Devil through and through, Dennis remains stubbornly loyal to the Arizona Cardinals, Phoenix Suns, and Arizona Diamondbacks, proving he has an incredibly high tolerance for heartache and disappointment.",
    ],
  },
  {
    name: "Shaun Thompson",
    initials: "ST",
    bio: null, // TODO: add Shaun's bio
  },
  {
    name: "Aaron Patterson",
    initials: "AP",
    photo: "/aaron-patterson.png",
    bio: [
      "Former corrections officer turned mechanical sales professional, proving that dealing with complex HVAC/mechanical specs isn't all that different from keeping peace in a cell house, just with slightly better air conditioning.",
      "Outside of work, he spends his free time voluntarily subjecting himself to the emotional rollercoasters of the Carolina Panthers, Atlanta Braves (World Series Champs 2021!!), and Nebraska Huskers. Yes, he chose all three (for no real particular reason either), and no, he will not be taking questions about his blood pressure.",
      "Driven by process, powered by dry humor and wit, and constantly waiting for \"next year\" to finally be the year. Sigh.",
    ],
  },
  {
    name: "Nicolas Bellenbaum",
    initials: "NB",
    bio: null, // TODO: add Nicolas's bio
  },
];

function FounderCard({ founder }) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm sm:flex-row sm:items-start">
      {founder.photo ? (
        <img
          src={founder.photo}
          alt={founder.name}
          className="h-24 w-24 shrink-0 rounded-full object-cover"
        />
      ) : (
        // TODO: replace with a real headshot photo of {founder.name}
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-2xl font-black text-white"
          aria-hidden="true"
        >
          {founder.initials}
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold text-neutral-900">{founder.name}</h3>
        {founder.bio ? (
          <div className="mt-2 space-y-3 text-neutral-600">
            {founder.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-neutral-600">Bio coming soon.</p>
        )}
      </div>
    </div>
  );
}

export default function About() {
  usePageMeta("About", "Our story and the co-founders behind Rad Dad Network.");

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <img
        src="/logo-full.jpg"
        alt="Rad Dad Network"
        className="mx-auto h-32 w-32 rounded-lg object-contain"
      />
      <h1 className="mt-8 text-center text-3xl font-black text-neutral-900 sm:text-4xl">
        Our Story
      </h1>

      <div className="mt-8 space-y-6 text-lg leading-relaxed text-neutral-700">
        <p>
          Rad Dad Network launched in 2023 with a simple idea: podcasts should feel like hanging
          out with your smartest, most entertaining friends, not sitting through a lecture. No
          pretentiousness, no gatekeeping, just real conversations about the things we're
          genuinely obsessed with.
        </p>
        <p>
          What started as one show has grown into a small family of podcasts covering sports
          betting, Formula 1, and military veteran resources, each with its own personality, but
          all built on the same foundation: be funny, be informative, and never take yourself too
          seriously.
        </p>
        <p>
          We're just getting started. If you've got a show idea and the drive to bring it to
          life, we'd love to hear from you.
        </p>
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-bold text-neutral-900">Meet the Co-Founders</h2>
        <div className="mt-6 space-y-6">
          {founders.map((founder) => (
            <FounderCard key={founder.name} founder={founder} />
          ))}
        </div>
      </div>
    </div>
  );
}
