"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { useAdmin } from "./AdminProvider";

const REASONS: Record<string, string> = {
  expired: "Your session expired. Please sign in again.",
  revoked: "You were signed out — the session was ended from another device or for your security.",
  "signed-out": "You've been signed out.",
};

const noSubscribe = () => () => {};

export function LoginForm() {
  const router = useRouter();
  const { status, signIn } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Static export: ?reason= exists only in the browser (null while prerendering)
  const reason = useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get("reason"),
    () => null,
  );
  const notice = reason ? (REASONS[reason] ?? null) : null;

  // Already signed in (session restored from the cookie) — go to the site
  useEffect(() => {
    if (status === "signed-in") router.replace("/");
  }, [status, router]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  const input =
    "w-full rounded-2xl border border-line bg-elevated px-4 py-3 text-fg outline-none transition placeholder:text-subtle focus:border-accent focus:ring-4 focus:ring-accent-soft";

  return (
    <main className="relative flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_60%_at_50%_0%,var(--glow),transparent)]" />

      <div className="relative w-full max-w-sm">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition hover:text-fg">
          <ArrowLeft className="size-4" /> Back to the website
        </Link>

        <div className="rounded-3xl border border-line bg-card p-7 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.35)] backdrop-blur-xl">
          <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent">
            <Lock className="size-5" />
          </span>
          <h1 className="font-serif text-4xl tracking-tight">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-muted">Use your dashboard account. You&apos;ll stay signed in on this browser.</p>

          {notice && !error && (
            <p className="mt-5 rounded-2xl bg-accent-soft px-4 py-3 text-sm" role="status">
              {notice}
            </p>
          )}
          {error && (
            <p className="mt-5 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={input}
                placeholder="admin@portfolio.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Password</span>
              <span className="relative block">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${input} pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted transition hover:text-fg"
                >
                  {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                </button>
              </span>
            </label>
            <button
              type="submit"
              disabled={busy || status === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-fg px-4 py-3 font-medium text-bg transition hover:opacity-90 disabled:opacity-60"
            >
              {busy && <LoaderCircle className="size-4 animate-spin" />}
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
