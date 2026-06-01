import { LegacyPageView } from "@/components/LegacyPageView";
import { legacyMetadata } from "@/lib/legacy";

export const metadata = legacyMetadata("blogs-blogs2");

export default function Page() {
  return <LegacyPageView slug="blogs-blogs2" />;
}
