"use client";

import { useEffect } from "react";

export type LegacyScriptsProps = {
  scripts: string[];
  /** Large Google Fonts CSS — applied after first paint to avoid blocking render */
  deferredStylesheetHrefs?: string[];
};

function scheduleAfterPaint(cb: () => void): { cancel: () => void } {
  if (typeof window === "undefined") return { cancel: () => {} };
  const ric = window.requestIdleCallback;
  if (typeof ric === "function") {
    const id = ric(() => cb(), { timeout: 1200 });
    return {
      cancel: () => {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(id);
        }
      },
    };
  }
  let raf1 = 0;
  let raf2 = 0;
  raf1 = window.requestAnimationFrame(() => {
    raf2 = window.requestAnimationFrame(cb);
  });
  return {
    cancel: () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    },
  };
}

/** Loads deferred font CSS without blocking initial layout (display=swap in URLs). */
function injectDeferredStylesheets(hrefs: string[]) {
  const seen = new Set(
    [...document.querySelectorAll("link[rel='stylesheet'][data-legacy-deferred-font]")].map(
      (l) => l.getAttribute("data-legacy-deferred-font") || "",
    ),
  );
  for (const href of hrefs) {
    if (!href || seen.has(href)) continue;
    seen.add(href);
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = href;
    el.media = "print";
    el.setAttribute("data-legacy-deferred-font", href);
    el.onload = () => {
      el.media = "all";
    };
    document.head.appendChild(el);
  }
}

/** Loads legacy JS after paint. Stylesheets are emitted server-side in LegacyPageView to prevent FOUC. */
export function LegacyScripts({
  scripts,
  deferredStylesheetHrefs = [],
}: LegacyScriptsProps) {
  const deferredKey = deferredStylesheetHrefs.join("|");
  const scriptsKey = scripts.join("|");

  // eslint-disable-next-line react-hooks/exhaustive-deps -- scriptsKey + deferredKey encode script/font URL sets
  useEffect(() => {
    let cancelled = false;
    const scriptEls: HTMLScriptElement[] = [];

    async function loadScripts() {
      if (deferredStylesheetHrefs.length > 0) {
        injectDeferredStylesheets(deferredStylesheetHrefs);
      }

      for (const name of scripts) {
        if (cancelled) break;
        await new Promise<void>((resolve, reject) => {
          const el = document.createElement("script");
          el.src = `/legacy-js/${name}`;
          el.async = false;
          el.onload = () => resolve();
          el.onerror = () => reject(new Error(`Failed to load ${name}`));
          document.body.appendChild(el);
          scriptEls.push(el);
        });
      }
    }

    const { cancel } = scheduleAfterPaint(() => {
      if (cancelled) return;
      void loadScripts().catch((e) => console.error(e));
    });

    /** Resolve anchor even when click target is a Text node inside `<a>` (`.closest` is only on Element). */
    const anchorFromEvent = (e: MouseEvent): HTMLAnchorElement | null => {
      const t = e.target;
      if (!t || !(t instanceof Node)) return null;
      const start = t instanceof Element ? t : t.parentElement;
      const a = start?.closest("a");
      return a instanceof HTMLAnchorElement ? a : null;
    };

    const onClick = (e: MouseEvent) => {
      const el = anchorFromEvent(e);
      if (!el) return;
      const href = el.getAttribute("href");
      if (!href) return;
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }
      if (href === "#" || (href.startsWith("#") && !href.includes("/"))) {
        return;
      }
      if (href.startsWith("/")) {
        e.preventDefault();
        window.location.assign(href);
      }
    };

    document.addEventListener("click", onClick, false);

    return () => {
      cancelled = true;
      cancel();
      document.removeEventListener("click", onClick, false);
      for (const s of scriptEls) s.remove();
    };
  }, [scriptsKey, deferredKey]);

  return null;
}
