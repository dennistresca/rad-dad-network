// Prerenders every real route into a static index.html under dist/, so
// search engines and link-preview bots that don't execute JavaScript see
// the actual page content and meta tags instead of the generic SPA shell.
//
// This is safe for this site specifically because every route is known
// ahead of time (no user-generated/dynamic paths) — see shows.js and
// App.jsx for the full route list. Run automatically after `vite build`
// via the "postbuild" npm script, in this repo and on Vercel alike: it
// uses puppeteer's own bundled Chromium (downloaded during `npm install`
// via puppeteer's postinstall step) rather than a system browser, so it
// works the same on any machine/CI without a hardcoded browser path.

import puppeteer from "puppeteer";
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

    browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-gpu"] });
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
