// Reads and writes src/data/pickOfTheDay.js through the GitHub contents API.
// Needs GITHUB_CONTENTS_TOKEN (fine-grained token, this repo only, Contents:
// read and write). The commit is authored by the token's owner, so Vercel
// treats it like any other push and redeploys the site.
const REPO = process.env.GITHUB_REPO || "dennistresca/rad-dad-network";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const FILE = "src/data/pickOfTheDay.js";

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_CONTENTS_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "rad-dad-network-picks",
  };
}

export function githubConfigured() {
  return Boolean(process.env.GITHUB_CONTENTS_TOKEN);
}

export async function readPickFile() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}?ref=${BRANCH}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`GitHub read failed (HTTP ${res.status})`);
  const json = await res.json();
  return { text: Buffer.from(json.content, "base64").toString("utf8"), sha: json.sha };
}

// Returns true when saved, false when someone else changed the file first.
export async function writePickFile(text, sha, message) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(text, "utf8").toString("base64"),
      sha,
      branch: BRANCH,
    }),
  });
  if (res.status === 409 || res.status === 422) return false;
  if (!res.ok) throw new Error(`GitHub write failed (HTTP ${res.status})`);
  return true;
}
