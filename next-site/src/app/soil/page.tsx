import { LegacyPageView } from "@/components/LegacyPageView";
import { legacyMetadata } from "@/lib/legacy";

export const metadata = legacyMetadata("soil");

export default function Page() {
  return <LegacyPageView slug="soil" />;
}
