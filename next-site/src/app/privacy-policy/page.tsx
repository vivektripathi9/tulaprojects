import { LegacyPageView } from "@/components/LegacyPageView";
import { legacyMetadata } from "@/lib/legacy";

export const metadata = legacyMetadata("privacy-policy");

export default function Page() {
  return <LegacyPageView slug="privacy-policy" />;
}
