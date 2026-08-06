import { Link } from "react-router-dom";
import Logo from "./Logo";
import { shows } from "../data/shows";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/raddadnetwork" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center rounded-md">
              <Logo className="h-14 w-14" />
            </Link>
            <p className="mt-3 text-sm text-neutral-400">
              Great conversations. Zero pretentiousness.
            </p>
          </div>

          <nav aria-label="Shows">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-100">
              Shows
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {shows.map((show) => (
                <li key={show.slug}>
                  <Link
                    to={`/shows/${show.slug}`}
                    className="rounded-md hover:text-white hover:underline"
                  >
                    {show.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Network">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-100">
              Network
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/store" className="rounded-md hover:text-white hover:underline">
                  Store
                </Link>
              </li>
              <li>
                <Link to="/about" className="rounded-md hover:text-white hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="rounded-md hover:text-white hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-100">
              Follow Along
            </h2>
            <ul className="mt-3 flex flex-wrap gap-3 text-sm">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md hover:text-white hover:underline"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-neutral-800 pt-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Rad Dad Network. All rights reserved.</p>
          <div className="flex gap-4">
            {/* TODO: real privacy policy page/URL */}
            <a href="#" className="rounded-md hover:text-neutral-200 hover:underline">
              Privacy Policy
            </a>
            {/* TODO: real terms of service page/URL */}
            <a href="#" className="rounded-md hover:text-neutral-200 hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
