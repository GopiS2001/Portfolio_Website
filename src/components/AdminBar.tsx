"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronUp, LayoutDashboard, LogOut, Pencil } from "lucide-react";
import { useAdmin } from "./AdminProvider";

/** The admin dashboard: NEXT_PUBLIC_DASHBOARD_URL, or port 8080 on the host that served this page. */
function dashboardUrl(path = "/dashboard") {
  const configured = process.env.NEXT_PUBLIC_DASHBOARD_URL;
  const base =
    configured || `${window.location.protocol}//${window.location.hostname}:8080`;
  return `${base.replace(/\/$/, "")}${path}`;
}

const EDIT_LINKS = [
  { label: "Home", path: "/dashboard/home" },
  { label: "About", path: "/dashboard/about" },
  { label: "Skills", path: "/dashboard/skills" },
  { label: "Experience", path: "/dashboard/experience" },
  { label: "Projects", path: "/dashboard/projects" },
  { label: "Contact", path: "/dashboard/contact" },
  { label: "Messages", path: "/dashboard/messages" },
  { label: "Configuration", path: "/dashboard/configuration" },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("") || "A";

/** Floating bar shown on the live site only while the admin is signed in. Visitors never see it. */
export function AdminBar() {
  const { status, user, signOut } = useAdmin();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const show = status === "signed-in" && !!user && pathname !== "/login";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="fixed bottom-5 left-4 z-40 sm:left-1/2 sm:-translate-x-1/2"
          role="region"
          aria-label="Admin"
        >
          <div className="flex items-center gap-1 rounded-full border border-line bg-elevated/90 p-1.5 pr-2 text-sm shadow-[0_12px_40px_-12px_rgb(0_0_0/0.35)] backdrop-blur-xl">
            <span className="grid size-8 place-items-center rounded-full bg-accent text-xs font-semibold text-bg">
              {initials(user.displayName)}
            </span>
            <span className="hidden px-2 sm:inline">
              <span className="font-medium">{user.displayName}</span>
              <span className="text-muted"> · Admin</span>
            </span>

            <a
              href={dashboardUrl()}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:bg-accent-soft"
              title="Open the admin dashboard"
            >
              <LayoutDashboard className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </a>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:bg-accent-soft"
              >
                <Pencil className="size-4" />
                <span className="hidden sm:inline">Edit</span>
                <ChevronUp className={`size-3.5 transition ${menuOpen ? "" : "rotate-180"}`} />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 overflow-hidden rounded-2xl border border-line bg-elevated p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.35)]"
                  >
                    <p className="px-3 pt-1.5 pb-1 text-xs text-subtle">Edit in dashboard</p>
                    {EDIT_LINKS.map((l) => (
                      <a
                        key={l.path}
                        role="menuitem"
                        href={dashboardUrl(l.path)}
                        className="block rounded-xl px-3 py-2 transition hover:bg-accent-soft"
                      >
                        {l.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="mx-0.5 h-5 w-px bg-line" aria-hidden />

            <button
              type="button"
              disabled={signingOut}
              onClick={async () => {
                setSigningOut(true);
                await signOut();
              }}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted transition hover:bg-accent-soft hover:text-fg disabled:opacity-50"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{signingOut ? "Signing out…" : "Sign out"}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
