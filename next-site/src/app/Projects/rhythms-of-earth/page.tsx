import { LegacyPageView } from "@/components/LegacyPageView";
import { legacyMetadata } from "@/lib/legacy";

export const metadata = legacyMetadata("projects-rhythms-of-earth");

export default function Page() {
  return <LegacyPageView slug="projects-rhythms-of-earth" />;
}
