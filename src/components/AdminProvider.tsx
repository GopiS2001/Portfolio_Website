"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  REFRESH_MARGIN_MS,
  getAccessTokenExpiry,
  hasSessionHint,
  isNetworkError,
  onSessionEnded,
  refreshSession,
  signIn as signInRequest,
  signOut as signOutRequest,
  type AdminUser,
} from "@/lib/admin-session";

type Status = "loading" | "signed-in" | "signed-out";

type AdminContextValue = {
  status: Status;
  user: AdminUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}

/** Retry an unreachable API this often (the session is kept meanwhile). */
const OFFLINE_RETRY_MS = 30_000;

/**
 * Restores the admin session when the site opens (if this browser signed in before),
 * refreshes the access token shortly before it expires, and sends the admin to /login
 * only when the session really ends: refresh token expired, session revoked, or sign-out.
 */
export function AdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [retryAt, setRetryAt] = useState(0);

  const restore = useCallback(async () => {
    try {
      const session = await refreshSession();
      setUser(session?.user ?? null);
      setStatus(session ? "signed-in" : "signed-out");
    } catch (error) {
      // API unreachable: don't sign out — try again shortly
      setStatus((s) => (s === "loading" ? "signed-out" : s));
      if (isNetworkError(error)) setRetryAt(Date.now() + OFFLINE_RETRY_MS);
    }
  }, []);

  // On open: only browsers that signed in before ask the API (visitors make no auth calls)
  useEffect(() => {
    if (hasSessionHint()) restore();
    else setStatus("signed-out");
  }, [restore]);

  // Retry after a network failure
  useEffect(() => {
    if (!retryAt) return;
    const id = setTimeout(() => hasSessionHint() && restore(), Math.max(0, retryAt - Date.now()));
    return () => clearTimeout(id);
  }, [retryAt, restore]);

  // Keep the access token fresh while signed in, and catch up when the tab becomes visible
  useEffect(() => {
    if (status !== "signed-in") return;
    const due = () => getAccessTokenExpiry() - REFRESH_MARGIN_MS;
    let timer = setTimeout(function tick() {
      restore().then(() => {
        timer = setTimeout(tick, Math.max(5_000, due() - Date.now()));
      });
    }, Math.max(0, due() - Date.now()));
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() >= due()) restore();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [status, restore]);

  // Session over (here or in another tab): back to the login page
  useEffect(
    () =>
      onSessionEnded((reason) => {
        setUser(null);
        setStatus("signed-out");
        if (pathname !== "/login") router.replace(`/login?reason=${reason}`);
      }),
    [pathname, router],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const signedIn = await signInRequest(email, password);
    setUser(signedIn);
    setStatus("signed-in");
  }, []);

  const value = useMemo(
    () => ({ status, user, signIn, signOut: signOutRequest }),
    [status, user, signIn],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
