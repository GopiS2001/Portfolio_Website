// Shape of GET /api/public/site — and of the offline snapshot files the backend writes.

export type ThemeMode = "light" | "dark" | "system";
export type SectionKey = "home" | "about" | "skills" | "experience" | "projects" | "contact";

export type SiteSettings = {
  siteEnabled: boolean;
  maintenanceMessage: string;
  siteTitle: string;
  metaDescription: string | null;
  showHeader: boolean;
  showHeaderCta: boolean;
  headerCtaLabel: string;
  enableThemeToggle: boolean;
  defaultTheme: ThemeMode;
  accentLight: string;
  accentDark: string;
  fontSans: string;
  fontSerif: string;
  baseFontSize: number;
  headingScale: number;
  showStats: boolean;
  showMarquee: boolean;
  showResumeButton: boolean;
  showContactForm: boolean;
  showFooter: boolean;
  showWhatsappButton: boolean;
  enableAnimations: boolean;
};

export type SiteProfile = {
  name: string;
  role: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  available: boolean;
  availabilityText: string;
  heroTitle: string;
  heroHighlight: string;
  heroTitleSuffix: string;
  tagline: string | null;
  primaryCtaLabel: string;
  resumeCtaLabel: string;
  email: string;
  phone: string;
  whatsapp: string;
  contactIntro: string | null;
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  website: string;
  footerText: string;
};

export type SiteSection = {
  key: SectionKey;
  visible: boolean;
  showInNav: boolean;
  sortOrder: number;
  navLabel: string;
  eyebrow: string;
  title: string;
  highlight: string;
  titleSuffix: string;
};

export type SiteData = {
  generatedAt: string;
  settings: SiteSettings;
  profile: SiteProfile;
  sections: SiteSection[];
  stats: { id: number; value: string; label: string }[];
  about: { paragraphs: string[]; highlights: { id: number; title: string; text: string }[] };
  skills: {
    groups: { id: number; title: string; icon: string; skills: string[] }[];
    marquee: string[];
  };
  experience: {
    id: number;
    role: string;
    company: string;
    period: string;
    location: string;
    description: string | null;
    stack: string[];
  }[];
  projects: {
    id: number;
    title: string;
    description: string;
    tags: string[];
    liveUrl: string;
    sourceUrl: string;
    imageUrl: string;
    gradient: string;
    featured: boolean;
  }[];
};
