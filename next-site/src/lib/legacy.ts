import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

export type LegacyCfg = {
  slug: string;
  source: string;
  scripts: string[];
  title: string;
  description: string;
  stylesheets: string[];
};

let mapCache: Record<string, LegacyCfg> | null = null;

function configMap(): Record<string, LegacyCfg> {
  if (!mapCache) {
    const p = path.join(process.cwd(), "content", "page-config.json");
    mapCache = JSON.parse(fs.readFileSync(p, "utf8")) as Record<string, LegacyCfg>;
  }
  return mapCache;
}

export function getLegacyConfig(slug: string): LegacyCfg {
  const m = configMap()[slug];
  if (!m) throw new Error(`Unknown legacy slug: ${slug}`);
  return m;
}

export function getLegacyPage(slug: string): LegacyCfg & { html: string } {
  const c = getLegacyConfig(slug);
  const htmlPath = path.join(process.cwd(), "content", "bodies", `${slug}.html`);
  const html = fs.readFileSync(htmlPath, "utf8");
  return { ...c, html };
}

export function legacyMetadata(slug: string): Metadata {
  const c = getLegacyConfig(slug);
  return {
    title: c.title,
    description: c.description,
  };
}
