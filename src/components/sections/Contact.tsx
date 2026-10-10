"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { whatsappHref } from "@/lib/links";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { InstagramIcon, WhatsappIcon } from "../SocialIcons";
import { useSite } from "../SiteProvider";

const field =
  "w-full rounded-2xl border border-line bg-bg/50 px-5 py-4 text-fg placeholder:text-subtle outline-none transition focus:border-accent focus:ring-4 focus:ring-accent-soft";

type Status = "idle" | "sending" | "sent";

export function Contact() {
  const { profile, settings } = useSite().data;
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  // Save the message to the dashboard inbox; if the API is down, hand it to the visitor's email app.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    try {
      const res = await fetch(apiUrl("/messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("idle");
      if (!profile.email) return;
      const subject = `Portfolio enquiry from ${data.name}`;
      const body = `${data.message}\n\n— ${data.name} (${data.email})`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const instagramHandle = profile.instagram
    .replace(/\/$/, "")
    .split("/")
    .pop();

  const details = [
    profile.email && { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && {
      icon: Phone,
      label: "Phone",
      value: profile.phone,
      href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
    },
    profile.whatsapp && {
      icon: WhatsappIcon,
      label: "WhatsApp",
      value: profile.whatsapp,
      href: whatsappHref(profile.whatsapp),
      external: true,
    },
    profile.instagram && {
      icon: InstagramIcon,
      label: "Instagram",
      value: instagramHandle ? `@${instagramHandle}` : profile.instagram,
      href: profile.instagram,
      external: true,
    },
    profile.location && { icon: MapPin, label: "Location", value: profile.location },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
  }[];

  return (
    <Section id="contact">
      <div
        className={`grid gap-8 ${settings.showContactForm ? "md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" : "max-w-2xl"}`}
      >
        <Reveal>
          <div className="flex h-full flex-col gap-4">
            {profile.contactIntro && (
              <p className="text-lg leading-relaxed text-muted">{profile.contactIntro}</p>
            )}

            {profile.email && (
              <button
                type="button"
                onClick={copyEmail}
                className="group mt-4 flex items-center justify-between gap-4 rounded-2xl border border-line bg-card p-5 text-left backdrop-blur transition hover:border-accent/40"
              >
                <span className="min-w-0">
                  <span className="block text-xs tracking-wide text-subtle uppercase">Copy email</span>
                  <span className="block truncate font-serif text-2xl">{profile.email}</span>
                </span>
                {copied ? (
                  <Check className="size-5 shrink-0 text-emerald-500" />
                ) : (
                  <Copy className="size-5 shrink-0 text-muted transition group-hover:text-accent" />
                )}
              </button>
            )}

            <ul className="space-y-1">
              {details.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="flex items-center gap-4 rounded-2xl px-2 py-3 transition hover:bg-card"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="size-4" />
                    </span>
                    <span>
                      <span className="block text-xs text-subtle">{label}</span>
                      <span className="text-sm">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {settings.showContactForm && (
          <Reveal delay={0.1}>
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-line bg-card p-6 backdrop-blur sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-muted">Name</span>
                  <input name="name" required maxLength={120} placeholder="Jane Doe" className={field} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-muted">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={160}
                    placeholder="jane@company.com"
                    className={field}
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-muted">Message</span>
                <textarea
                  name="message"
                  required
                  rows={6}
                  maxLength={5000}
                  placeholder="Tell me about your project…"
                  className={`${field} resize-none`}
                />
              </label>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-fg px-7 py-4 text-sm font-medium text-bg transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                  {status === "sending" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </button>
                {status === "sent" && (
                  <p role="status" className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <Check className="size-4" /> Thanks! Your message was sent.
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
