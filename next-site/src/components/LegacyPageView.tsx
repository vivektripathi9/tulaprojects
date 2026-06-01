import { LegacyScripts } from "@/components/LegacyScripts";
import { getLegacyPage } from "@/lib/legacy";

function isGoogleFontCss(href: string) {
  return href.includes("fonts.googleapis.com");
}

export function LegacyPageView({ slug }: { slug: string }) {
  const p = getLegacyPage(slug);
  const blockingCss = p.stylesheets.filter((h) => !isGoogleFontCss(h));
  const deferredFontCss = p.stylesheets.filter(isGoogleFontCss);

  return (
    <>
      {/* Early hints: legacy JS starts downloading while CSS applies */}
      {p.scripts.map((name, i) => (
        <link
          key={`preload-${name}`}
          rel="preload"
          href={`/legacy-js/${name}`}
          as="script"
          fetchPriority={i === 0 ? "high" : "low"}
        />
      ))}
      {/* Page + shared chrome first; fonts load after paint via LegacyScripts */}
      {blockingCss.map((href, i) => (
        <link
          key={href}
          rel="stylesheet"
          href={href}
          fetchPriority={i < 2 ? "high" : "low"}
        />
      ))}
      <div
        className="legacy-html-root"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: p.html }}
      />
      <LegacyScripts scripts={p.scripts} deferredStylesheetHrefs={deferredFontCss} />
    </>
  );
}
