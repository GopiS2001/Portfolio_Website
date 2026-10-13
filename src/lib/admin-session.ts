import { apiUrl } from "@/lib/api";

// Admin session for the public website.
//
//  - Access token (15 min): memory only — never written to localStorage/sessionStorage.
//  - Refresh token (7 days): httpOnly cookie `pf_rt_website` set by the API, scoped to
//    /api/auth. Scripts can't read it; the browser sends it with credentialed requests.
//  - `pf-admin` in localStorage is only a hint ("this browser has signed in"), so ordinary
//    visitors never trigger a refresh request. It contains no secret.
//  - Only a 401 from /auth/refresh ends the session (expired, revoked, or signed out);
//    network errors keep it, so an API restart doesn't sign you out.

export type AdminUser = { id: number; email: string; displayName: string; role: string };
export type SessionEndReason = "signed-out" | "expired" | "revoked";
type TokenResponse = { accessToken: string; accessTokenExpiresAt: number; user: AdminUser };

const HINT_KEY = "pf-admin";
const AUTH_HEADERS = { "Content-Type": "application/json", "X-Client-App": "website" };
/** Refresh this long before the access token expires. */
export const REFRESH_MARGIN_MS = 60_000;

let accessToken: string | null = null;
let expiresAt = 0;
let inflight: Promise<TokenResponse | null> | null = null;

const endListeners = new Set<(reason: SessionEndReason) => void>();
const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("pf-website-auth") : null;

channel?.addEventListener("message", (event: MessageEvent<{ type: string; reason?: SessionEndReason }>) => {
  if (event.data?.type === "ended") endSession(event.data.reason ?? "signed-out", false);
});

class NetworkError extends Error {}

async function authPost(path: string, body?: unknown, token?: string | null) {
  let res: Response;
  try {
    res = await fetch(apiUrl(`/auth/${path}`), {
      method: "POST",
      credentials: "include",
      headers: { ...AUTH_HEADERS, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body ?? {}),
    });
  } catch {
    throw new NetworkError("Cannot reach the server. Is the API running?");
  }
  const data = await res.json().catch(() => null);
  return { res, data };
}

const setHint = (on: boolean) => {
  try {
    if (on) localStorage.setItem(HINT_KEY, "1");
    else localStorage.removeItem(HINT_KEY);
  } catch {
    // Storage blocked — the session still works for this page view
  }
};

export const hasSessionHint = () => {
  try {
    return localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
};

export const getAccessTokenExpiry = () => expiresAt;

// ---------------------------------------------------------------------- sign in / refresh / out

export async function signIn(email: string, password: string): Promise<AdminUser> {
  const { res, data } = await authPost("sign-in", { email, password });
  if (!res.ok) {
    const raw = data?.message;
    throw new Error((Array.isArray(raw) ? raw.join(", ") : raw) || "Sign-in failed");
  }
  accessToken = data.accessToken;
  expiresAt = data.accessTokenExpiresAt;
  setHint(true);
  return data.user;
}

/**
 * Exchanges the refresh cookie for a new access token (one request shared by concurrent
 * callers). Resolves to null — and ends the session — when the API says it's over.
 * Throws NetworkError when the API can't be reached.
 */
export function refreshSession(): Promise<TokenResponse | null> {
  if (!inflight) {
    inflight = (async () => {
      const { res, data } = await authPost("refresh");
      if (res.ok) {
        accessToken = data.accessToken;
        expiresAt = data.accessTokenExpiresAt;
        setHint(true);
        return data as TokenResponse;
      }
      if (res.status === 401) {
        endSession(data?.code === "SESSION_REVOKED" ? "revoked" : "expired");
        return null;
      }
      throw new Error(data?.message || `Refresh failed (${res.status})`);
    })().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

export async function signOut() {
  try {
    await authPost("sign-out", {}, accessToken);
  } catch {
    // Unreachable API: still forget the session in this browser
  } finally {
    endSession("signed-out");
  }
}

// ---------------------------------------------------------------------- end of session

export function endSession(reason: SessionEndReason, broadcast = true) {
  const wasSignedIn = accessToken !== null || hasSessionHint();
  accessToken = null;
  expiresAt = 0;
  setHint(false);
  if (broadcast && wasSignedIn) channel?.postMessage({ type: "ended", reason });
  if (wasSignedIn || !broadcast) endListeners.forEach((l) => l(reason));
}

export function onSessionEnded(listener: (reason: SessionEndReason) => void) {
  endListeners.add(listener);
  return () => {
    endListeners.delete(listener);
  };
}

export const isNetworkError = (error: unknown) => error instanceof NetworkError;
