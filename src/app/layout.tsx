import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import snapshot from "@/data/site-snapshot.json";
import type { SiteData } from "@/lib/site-types";
import { AdminProvider } from "@/components/AdminProvider";
import { AdminBar } from "@/components/AdminBar";
import "./globals.css";

const site = snapshot as SiteData;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: site.settings.siteTitle || `${site.profile.name} — ${site.profile.role}`,
  description: site.settings.metaDescription || site.profile.tagline || undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
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
  "--accent-light": s.accentLight,
  "--accent-dark": s.accentDark,
} as React.CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={initialStyle}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* If JavaScript can't run, show content instead of leaving it mid-animation */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      {/* Browser extensions (ColorZilla, form fillers) inject attributes on <body> before hydration */}
      <body className="grain min-h-full font-sans" suppressHydrationWarning>
        {/* Admin session (signed-in admins get a floating bar; visitors see nothing) */}
        <AdminProvider>
          {children}
          <AdminBar />
        </AdminProvider>
      </body>
    </html>
  );
}
