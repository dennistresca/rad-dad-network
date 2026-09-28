// Prerenders every real route into a static index.html under dist/, so
// search engines and link-preview bots that don't execute JavaScript see
// the actual page content and meta tags instead of the generic SPA shell.
//
// This is safe for this site specifically because every route is known
// ahead of time (no user-generated/dynamic paths) — see shows.js and
// App.jsx for the full route list. Run automatically after `vite build`
// via the "postbuild" npm script, in this repo and on Vercel alike.
//
// Uses @sparticuz/chromium (a Chromium binary bundled directly in the npm
// package, built for serverless Linux environments like Vercel's build
// image) with puppeteer-core, instead of plain puppeteer. Plain puppeteer
// downloads Chromium via a postinstall script, which both this sandbox and
// Vercel's build environment block by default (npm's install-scripts
// allowlisting) — confirmed via Vercel build logs: "Could not find Chrome".
// @sparticuz/chromium has no postinstall step, so it sidesteps that
// entirely. It only ships a Linux binary, so this script can't actually
// prerender on a local Windows/Mac dev machine — that's fine, prerendering
// is a production/Vercel-only enhancement and the fault-tolerant wrapper
// below just skips it locally.

import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const PREVIEW_PORT = 4173;
const DIST_DIR = fileURLToPath(new URL("../dist/", import.meta.url));

// Every real route on the site. Keep this in sync with App.jsx routes and
// shows.js — also update public/sitemap.xml when this list changes.
const routes = [
  "/",
  "/shows/dancing-with-the-odds",
  "/shows/dancing-with-the-odds/road-to-10k",
  "/shows/dancing-with-the-odds/pick-of-the-day",
  "/shows/dancing-with-the-odds/cfb-futures",
  "/shows/dancing-with-the-odds/nfl-futures",
  "/shows/dancing-with-the-odds/model-tracker",
  "/shows/stateside-speed",
  "/shows/check-six-radio",
  "/store",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        // not up yet
      }
      if (Date.now() - start > timeoutMs) return reject(new Error("preview server did not start in time"));
      setTimeout(tick, 300);
    };
    tick();
  });
}

async function outputPathFor(route) {
  const dir = route === "/" ? DIST_DIR : path.join(DIST_DIR, route);
  await mkdir(dir, { recursive: true });
  return path.join(dir, "index.html");
}

async function main() {
  console.log("Starting preview server...");
  const preview = spawn("npx", ["vite", "preview", "--port", String(PREVIEW_PORT), "--strictPort"], {
    shell: true,
    stdio: "ignore",
  });

  let browser;
  try {
    const base = `http://localhost:${PREVIEW_PORT}`;
    await waitForServer(base);

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();

    for (const route of routes) {
      const url = `${base}${route}`;
      process.stdout.write(`Prerendering ${route} ... `);
      await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });
      const html = await page.content();
      const outPath = await outputPathFor(route);
      await writeFile(outPath, html, "utf8");
      console.log("done");
    }

    console.log(`Prerendered ${routes.length} routes.`);
  } finally {
    if (browser) await browser.close();
    preview.kill();
  }
}

// Prerendering is an enhancement, not a requirement — the site already
// works correctly as a plain client-rendered SPA without it (that's how
// it ran before this script existed). So a failure here (no Chromium
// available, a route timing out, etc.) must NEVER fail the overall
// `npm run build`, or it takes the whole deploy down with it. Log the
// failure clearly and exit successfully either way.
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Prerendering failed, continuing without it:", err);
    process.exit(0);
  });
