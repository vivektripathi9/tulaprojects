import { LegacyPageView } from "@/components/LegacyPageView";
import { legacyMetadata } from "@/lib/legacy";

export const metadata = legacyMetadata("channel-partners");

export default function Page() {
  return <LegacyPageView slug="channel-partners" />;
}
