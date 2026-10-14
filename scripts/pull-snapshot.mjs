// Runs before `next build`: pulls the latest content from the API into the bundled snapshot,
// so the exported static site contains the exact current data. If the API is unreachable the
// existing snapshot (last written by the backend) is kept and the build continues. Waits up to a
// minute, because a free hosted API (Render) may need that long to wake up.
//
// It also copies the uploaded files the content uses (profile photo, project covers…) from
// ../BACKEND/uploads into public/uploads, so a deployed site (e.g. on Vercel) can show them
// without the API — the site maps http://localhost:4000/uploads/… to /uploads/….
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
const targets = ["src/data/site-snapshot.json", "public/site-data.json"];
const UPLOADS_SRC = path.resolve("../BACKEND/uploads");
const UPLOADS_DEST = path.resolve("public/uploads");

try {
  const res = await fetch(`${api}/public/site`, { signal: AbortSignal.timeout(60000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const json = JSON.stringify(data, null, 2);
  await Promise.all(targets.map((file) => writeFile(file, json, "utf8")));
  console.log(`✓ Snapshot updated from ${api} (${data.generatedAt})`);
} catch (err) {
  console.warn(`! Could not reach ${api} (${err.message}) — building with the existing snapshot.`);
}

// Copy the uploads referenced by the snapshot (skipped where the backend folder isn't present,
// e.g. on Vercel — the files copied by your last local build are deployed with the site).
const snapshot = await readFile(targets[0], "utf8");
const files = [
  ...new Set(
    [...snapshot.matchAll(/https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/uploads\/([\w.-]+)/g)].map((m) => m[1]),
  ),
];
if (files.length && existsSync(UPLOADS_SRC)) {
  await mkdir(UPLOADS_DEST, { recursive: true });
  let copied = 0;
  for (const file of files) {
    const from = path.join(UPLOADS_SRC, file);
    if (existsSync(from)) {
      await copyFile(from, path.join(UPLOADS_DEST, file));
      copied++;
    } else {
      console.warn(`! Upload not found: ${file}`);
    }
  }
  console.log(`✓ Copied ${copied} uploaded file(s) into public/uploads`);
} else if (files.length) {
  const missing = files.filter((f) => !existsSync(path.join(UPLOADS_DEST, f)));
  if (missing.length) console.warn(`! ${missing.length} uploaded file(s) are not in public/uploads: ${missing.join(", ")}`);
}
