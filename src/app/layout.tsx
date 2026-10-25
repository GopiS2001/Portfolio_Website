import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import snapshot from "@/data/site-snapshot.json";
import type { SiteData } from "@/lib/site-types";
import { SITE_URL, socialLinks } from "@/lib/links";
import { AdminProvider } from "@/components/AdminProvider";
import { AdminBar } from "@/components/AdminBar";
import "./globals.css";

const site = snapshot as SiteData;

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500"],
});

const title = site.settings.siteTitle || `${site.profile.name} — ${site.profile.role}`;
const description =
  site.settings.metaDescription ||
  site.profile.tagline ||
  `${site.profile.name}, ${site.profile.role}. Portfolio, projects and contact.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    siteName: site.profile.name,
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e6e9ef" },
    { media: "(prefers-color-scheme: dark)", color: "#23262d" },
  ],
};

// Runs before first paint so the theme never flashes. Uses the build-time settings;
// SiteProvider re-applies them once the live settings arrive.
const { defaultTheme, enableThemeToggle } = site.settings;
const themeScript = `(function(){try{var d=${JSON.stringify(defaultTheme)},t=${enableThemeToggle}?localStorage.getItem("theme"):null;if(t!=="light"&&t!=="dark"){t=d}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`;

const s = site.settings;
const initialStyle = {
  "--site-font-size": `${s.baseFontSize || 16}px`,
  "--heading-scale": String((s.headingScale || 100) / 100),
} as React.CSSProperties;

// schema.org Person, so search engines can tie the site to the social profiles
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.profile.name,
  jobTitle: site.profile.role,
  url: SITE_URL,
  email: site.profile.email ? `mailto:${site.profile.email}` : undefined,
  address: site.profile.location
    ? { "@type": "PostalAddress", addressLocality: site.profile.location }
    : undefined,
  sameAs: socialLinks(site.profile)
    .filter((l) => l.label !== "WhatsApp")
    .map((l) => l.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={initialStyle}
      className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        {/* If JavaScript can't run, show content instead of leaving it mid-animation */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      {/* Browser extensions (ColorZilla, form fillers) inject attributes on <body> before hydration */}
      <body className="min-h-full font-sans" suppressHydrationWarning>
        {/* Admin session (signed-in admins get a floating bar; visitors see nothing) */}
        <AdminProvider>
          {children}
          <AdminBar />
        </AdminProvider>
      </body>
    </html>
  );
}
