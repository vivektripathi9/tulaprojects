import { LegacyPageView } from "@/components/LegacyPageView";
import { legacyMetadata } from "@/lib/legacy";

export const metadata = legacyMetadata("terms-and-conditions");

export default function Page() {
  return <LegacyPageView slug="terms-and-conditions" />;
}
