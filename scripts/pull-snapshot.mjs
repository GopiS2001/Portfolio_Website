// Runs before `next build`: pulls the latest content from the API into the bundled snapshot,
// so the exported static site contains the exact current data. If the API is unreachable the
// existing snapshot (last written by the backend) is kept and the build continues.
import { writeFile } from "node:fs/promises";

const api = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/$/, "");
const targets = ["src/data/site-snapshot.json", "public/site-data.json"];

try {
  const res = await fetch(`${api}/public/site`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const json = JSON.stringify(data, null, 2);
  await Promise.all(targets.map((file) => writeFile(file, json, "utf8")));
  console.log(`✓ Snapshot updated from ${api} (${data.generatedAt})`);
} catch (err) {
  console.warn(`! Could not reach ${api} (${err.message}) — building with the existing snapshot.`);
}
