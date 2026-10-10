// Where the NestJS API lives. Set NEXT_PUBLIC_API_URL at build time to override;
// otherwise use port 4000 on whatever host served the page (works on the LAN too).
export function apiUrl(path: string) {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  const base =
    configured ||
    (typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.hostname}:4000/api`
      : "http://localhost:4000/api");
  return `${base.replace(/\/$/, "")}${path}`;
}
