import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { shows } from "../data/shows";

const navLinks = [
  { to: "/", label: "Home" },
  ...shows.map((show) => ({ to: `/shows/${show.slug}`, label: show.shortName })),
  { to: "/store", label: "Store" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function linkClasses({ isActive }) {
  return [
    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-orange-500 text-white"
      : "text-neutral-200 hover:bg-neutral-800 hover:text-white",
  ].join(" ");
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-neutral-950 shadow-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-offset-4"
          onClick={() => setIsOpen(false)}
        >
          <Logo className="h-11 w-11 shrink-0" />
          <span className="text-lg font-black tracking-tight text-white">Rad Dad Network</span>
        </NavLink>

        <button
          type="button"
          className="rounded-md p-2 text-neutral-200 hover:bg-neutral-800 lg:hidden"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="sr-only">
            {isOpen ? "Close main menu" : "Open main menu"}
          </span>
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClasses}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && (
        <ul
          id="primary-navigation"
          className="space-y-1 border-t border-neutral-800 px-4 pb-4 pt-2 lg:hidden"
        >
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={linkClasses} onClick={() => setIsOpen(false)}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
