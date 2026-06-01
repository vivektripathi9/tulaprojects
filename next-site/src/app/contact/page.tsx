import { LegacyPageView } from "@/components/LegacyPageView";
import { legacyMetadata } from "@/lib/legacy";

export const metadata = legacyMetadata("contact");

export default function Page() {
  return <LegacyPageView slug="contact" />;
}
