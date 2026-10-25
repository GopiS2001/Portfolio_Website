"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, CheckCircle2, Copy, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { apiUrl } from "@/lib/api";
import { cleanUrl, whatsappHref } from "@/lib/links";
import { NeuButton, NeuIconButton, NeuInput, NeuTextarea } from "../neu";
import { Reveal } from "../Reveal";
import { Section } from "../Section";
import { InstagramIcon, WhatsappIcon } from "../SocialIcons";
import { useSite } from "../SiteProvider";

type Status = "idle" | "sending" | "sent";
type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate({ name, email, message }: Fields): Errors {
  const errors: Errors = {};
  if (name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(email.trim())) errors.email = "Please enter a valid email address.";
  if (message.trim().length < 10) errors.message = "Tell me a little more — at least 10 characters.";
  return errors;
}

export function Contact() {
  const { profile, settings } = useSite().data;
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  // Save the message to the dashboard inbox; if the API is down, hand it to the visitor's email app.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Fields;
    const found = validate(data);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(apiUrl("/messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name.trim(), email: data.email.trim(), message: data.message.trim() }),
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

  // Clear a field's error as soon as it's fixed
  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement;
    const key = target.name as keyof Fields;
    if (!errors[key]) return;
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Fields;
    if (!validate(data)[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const instagram = cleanUrl(profile.instagram);
  const instagramHandle = instagram ? new URL(instagram).pathname.replace(/\//g, "") : "";

  const details = [
    profile.email && { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, copy: true },
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
    instagram && {
      icon: InstagramIcon,
      label: "Instagram",
      value: instagramHandle ? `@${instagramHandle}` : instagram,
      href: instagram,
      external: true,
    },
    profile.location && { icon: MapPin, label: "Location", value: profile.location },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    value: string;
    href?: string;
    external?: boolean;
    copy?: boolean;
  }[];

  return (
    <Section id="contact">
      <div
        className={`grid gap-10 ${settings.showContactForm ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" : "max-w-2xl"}`}
      >
        <Reveal>
          {profile.contactIntro && (
            <p className="text-base leading-relaxed text-muted sm:text-[1.0625rem]">{profile.contactIntro}</p>
          )}
          <ul className="mt-8 space-y-5">
            {details.map(({ icon: Icon, label, value, href, external, copy }) => (
              <li key={label} className="flex items-center gap-4">
                <span className="neu-sm grid size-12 shrink-0 place-items-center rounded-full text-accent-ink">
                  <Icon aria-hidden className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium tracking-wide text-subtle uppercase">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      className="block truncate font-medium text-fg transition-colors hover:text-accent-ink"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="truncate font-medium">{value}</p>
                  )}
                </div>
                {copy && (
                  <NeuIconButton label={copied ? "Email copied" : "Copy email address"} size="sm" onClick={copyEmail}>
                    {copied ? <Check className="size-4 text-success-ink" /> : <Copy className="size-4" />}
                  </NeuIconButton>
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        {settings.showContactForm && (
          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} onChange={onChange} noValidate className="neu p-6 sm:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <NeuInput
                  name="name"
                  label="Name"
                  autoComplete="name"
                  maxLength={120}
                  placeholder="Jane Doe"
                  error={errors.name}
                />
                <NeuInput
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  maxLength={160}
                  placeholder="jane@company.com"
                  error={errors.email}
                />
              </div>
              <NeuTextarea
                name="message"
                label="Message"
                rows={6}
                maxLength={5000}
                placeholder="Tell me about your project…"
                error={errors.message}
                className="mt-5"
              />
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <NeuButton type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
                  {status === "sending" ? "Sending…" : "Send message"}
                  {status === "sending" ? (
                    <Loader2 aria-hidden className="size-4 animate-spin" />
                  ) : (
                    <Send aria-hidden className="size-4" />
                  )}
                </NeuButton>
                <p role="status" className="text-sm">
                  {status === "sent" && (
                    <span className="flex items-center gap-2 font-medium text-success-ink">
                      <CheckCircle2 aria-hidden className="size-4" /> Thanks! Your message was sent.
                    </span>
                  )}
                </p>
              </div>
            </form>
          </Reveal>
        )}
      </div>

      {/* "Copied!" toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="neu fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
          >
            <Check aria-hidden className="size-4 text-success-ink" /> Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
