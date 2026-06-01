import { LegacyPageView } from "@/components/LegacyPageView";
import { legacyMetadata } from "@/lib/legacy";

export const metadata = legacyMetadata("blogs-blog1");

export default function Page() {
  return <LegacyPageView slug="blogs-blog1" />;
}
