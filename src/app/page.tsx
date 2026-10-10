import snapshot from "@/data/site-snapshot.json";
import type { SiteData } from "@/lib/site-types";
import { SiteProvider } from "@/components/SiteProvider";
import { SiteContent } from "@/components/SiteContent";

export default function Home() {
  return (
    <SiteProvider initial={snapshot as SiteData}>
      <SiteContent />
    </SiteProvider>
  );
}
