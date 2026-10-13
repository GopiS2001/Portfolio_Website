import type { SiteData } from "@/lib/site-types";

// Files uploaded in the dashboard are stored by the API with its PUBLIC_URL, which is
// http://localhost:4000 while the API runs on your computer. Those links only work on that
// computer, so point them at the copies the build puts in public/uploads (see
// scripts/pull-snapshot.mjs). Real public URLs (a hosted API, Google Drive, …) are left alone.
const LOCAL_UPLOAD = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/uploads\//;

// A Google Drive "share" link (…/file/d/<id>/view) opens a web page, not an image.
// For image fields, use Drive's direct image address instead (the file must be shared
// with "Anyone with the link").
const DRIVE_FILE = /^https:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]{10,})/;

export function driveImage(url: string) {
  const match = url.match(DRIVE_FILE);
  return match ? `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1600` : url;
}

export function localizeUploads(data: SiteData): SiteData {
  const fix = (value: unknown): unknown => {
    if (typeof value === "string") return LOCAL_UPLOAD.test(value) ? value.replace(LOCAL_UPLOAD, "/uploads/") : value;
    if (Array.isArray(value)) return value.map(fix);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fix(v)]));
    }
    return value;
  };
  const fixed = fix(data) as SiteData;
  // Image fields only — the résumé link should keep opening Drive's viewer
  return {
    ...fixed,
    profile: { ...fixed.profile, avatarUrl: fixed.profile.avatarUrl && driveImage(fixed.profile.avatarUrl) },
    projects: fixed.projects.map((p) => ({ ...p, imageUrl: p.imageUrl && driveImage(p.imageUrl) })),
  };
}
