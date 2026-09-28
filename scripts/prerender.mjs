// Prerenders every real route into a static index.html under dist/, so
// search engines and link-preview bots that don't execute JavaScript see
// the actual page content and meta tags instead of the generic SPA shell.
//
// This is safe for this site specifically because every route is known
// ahead of time (no user-generated/dynamic paths) — see shows.js and
// App.jsx for the full route list. Run automatically after `vite build`
// via the "postbuild" npm script. Requires Chrome at the path below
// (same technique used elsewhere in this project for social graphics).

import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";
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

function dumpDom(url) {
  return new Promise((resolve, reject) => {
    const chrome = spawn(CHROME_PATH, [
      "--headless",
      "--disable-gpu",
      "--dump-dom",
      "--virtual-time-budget=3000",
      url,
    ]);
    let out = "";
    chrome.stdout.on("data", (d) => (out += d));
    chrome.on("close", (code) => {
      if (code === 0 && out.trim()) resolve(out);
      else reject(new Error(`chrome --dump-dom failed for ${url} (exit ${code})`));
    });
    chrome.on("error", reject);
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

  try {
    const base = `http://localhost:${PREVIEW_PORT}`;
    await waitForServer(base);

    for (const route of routes) {
      const url = `${base}${route}`;
      process.stdout.write(`Prerendering ${route} ... `);
      const html = await dumpDom(url);
      const outPath = await outputPathFor(route);
      await writeFile(outPath, html, "utf8");
      console.log("done");
    }

    console.log(`Prerendered ${routes.length} routes.`);
  } finally {
    preview.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
