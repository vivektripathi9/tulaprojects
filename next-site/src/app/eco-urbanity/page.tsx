import { LegacyPageView } from "@/components/LegacyPageView";
import { legacyMetadata } from "@/lib/legacy";

export const metadata = legacyMetadata("eco-urbanity");

export default function Page() {
  return <LegacyPageView slug="eco-urbanity" />;
}
