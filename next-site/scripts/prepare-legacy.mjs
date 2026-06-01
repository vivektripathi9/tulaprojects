/**
 * Syncs static assets + legacy JS from the parent site repo into this Next app,
 * and writes stripped/rewritten HTML bodies to content/bodies/*.html
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEXT_SITE = path.resolve(__dirname, "..");
const SITE_ROOT = path.resolve(NEXT_SITE, "..");
/** Canonical HTML sources for `prepare:legacy` (production pages only). */
const HTML_SOURCE = path.join(NEXT_SITE, "legacy-html");

const BODIES_DIR = path.join(NEXT_SITE, "content", "bodies");
const PUBLIC = path.join(NEXT_SITE, "public");
const LEGACY_JS = path.join(PUBLIC, "legacy-js");
const PAGE_CONFIG = path.join(NEXT_SITE, "content", "page-config.json");

const ASSET_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".ico",
  ".mp4",
  ".mov",
  ".webp",
  ".gif",
  ".pdf",
  ".webm",
]);

/** Source HTML path (relative to SITE_ROOT) -> slug + scripts to load after inject */
const PAGES = [
  {
    rel: "index.html",
    slug: "home",
    scripts: ["navbar.js", "script.js", "footer-email.js", "home-inline.js"],
  },
  {
    rel: "contact/index.html",
    slug: "contact",
    scripts: ["navbar.js", "footer-email.js", "contact-inline.js"],
  },
  { rel: "soil/index.html", slug: "soil", scripts: ["navbar.js", "footer-email.js"] },
  {
    rel: "eco-urbanity/index.html",
    slug: "eco-urbanity",
    scripts: ["navbar.js", "footer-email.js"],
  },
  {
    rel: "design-prospects/index.html",
    slug: "design-prospects",
    scripts: ["navbar.js", "footer-email.js"],
  },
  {
    rel: "channel-partners/index.html",
    slug: "channel-partners",
    scripts: ["navbar.js", "footer-email.js"],
  },
  { rel: "career/index.html", slug: "career", scripts: ["navbar.js", "footer-email.js", "career-inline.js"] },
  {
    rel: "leadership/index.html",
    slug: "leadership",
    scripts: ["navbar.js", "footer-email.js"],
  },
  { rel: "Projects/index.html", slug: "projects", scripts: ["navbar.js", "footer-email.js"] },
  {
    rel: "Projects/rhythms-of-earth.html",
    slug: "projects-rhythms-of-earth",
    scripts: ["projects-script.js", "navbar.js", "footer-email.js"],
  },
  { rel: "blogs/index.html", slug: "blogs", scripts: ["navbar.js", "footer-email.js"] },
  { rel: "blogs/blog1.html", slug: "blogs-blog1", scripts: ["navbar.js", "footer-email.js"] },
  { rel: "blogs/blogs2.html", slug: "blogs-blogs2", scripts: ["navbar.js", "footer-email.js"] },
  { rel: "blogs/blogs3.html", slug: "blogs-blogs3", scripts: ["navbar.js", "footer-email.js"] },
  {
    rel: "privacy-policy/index.html",
    slug: "privacy-policy",
    scripts: ["navbar.js", "footer-email.js"],
  },
  {
    rel: "disclaimer/index.html",
    slug: "disclaimer",
    scripts: ["navbar.js", "footer-email.js"],
  },
  {
    rel: "t&c/index.html",
    slug: "terms-and-conditions",
    scripts: ["navbar.js", "footer-email.js"],
  },
];

function posix(p) {
  return p.split(path.sep).join("/");
}

function encodedBaseUrlForFile(relFile) {
  const norm = posix(relFile);
  const dir = path.posix.dirname(norm);
  if (dir === ".") return "https://legacy.local/";
  const enc = dir
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `https://legacy.local/${enc}/`;
}

function postProcessAppPath(p) {
  let out = decodeURIComponent(p);
  out = out.replace(/^\/t%26c(\/|$)/i, "/terms-and-conditions$1");
  out = out.replace(/^\/t&c(\/|$)/i, "/terms-and-conditions$1");
  /**
   * Legacy nav used `./leadership/...` inside nested sources (`blogs/*.html`, `contact/index.html`, …).
   * Resolved against that folder it becomes `/blogs/leadership` — wrong. Canonical route is `/leadership`.
   */
  out = out.replace(/^\/[^/]+\/leadership$/i, "/leadership");
  if (out.length > 1) out = out.replace(/\/+$/, "");
  return out || "/";
}

/** mode "page" = strip index.html / .html routes; "asset" = paths only (css, images, …) */
function resolveAppPath(val, relFile, mode) {
  const v = val.trim();
  if (!v) return v;
  /** Legacy footers used `href="www.example.com"` (no scheme); URL() would treat as a path. */
  if (/^www\./i.test(v)) {
    return `https://${v}`;
  }
  if (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("mailto:") ||
    v.startsWith("tel:") ||
    v.startsWith("data:") ||
    v.startsWith("javascript:")
  ) {
    return v;
  }
  if (v === "#") return "#";
  if (v.startsWith("#") && !v.includes("/")) return v;

  const base = encodedBaseUrlForFile(relFile);
  let u;
  try {
    u = new URL(v, base);
  } catch {
    return v;
  }
  if (u.origin !== "https://legacy.local") return v;

  let p = u.pathname;
  p = postProcessAppPath(p);

  if (mode === "page") {
    if (p.endsWith("/index.html")) p = p.slice(0, -"/index.html".length) || "/";
    else if (p.endsWith(".html")) p = p.slice(0, -5);
    if (p === "/index" || p === "") p = "/";
    p = postProcessAppPath(p);
    return u.hash ? `${p}${u.hash}` : p;
  }

  p = postProcessAppPath(p);
  return u.hash ? `${p}${u.hash}` : p;
}

function stripScripts(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gim, "");
}

function extractBodyInner(html) {
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!m) throw new Error("No <body> found");
  return m[1].trim();
}

function rewriteAttrs(html, relFile) {
  return html.replace(/\s(src|href)="([^"]*)"/gi, (full, attr, val) => {
    const a = String(attr).toLowerCase();
    const mode = a === "href" ? "page" : "asset";
    const next = resolveAppPath(val, relFile, mode);
    return ` ${attr}="${next}"`;
  });
}

function extractHeadMeta(html, relFile) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const head = headMatch ? headMatch[1] : "";
  const title = (head.match(/<title>([^<]*)<\/title>/i) || [, ""])[1].trim();
  let description = "";
  const metaDescTag = head.match(
    /<meta[^>]*name\s*=\s*["']description["'][^>]*>/i
  );
  if (metaDescTag) {
    const cm = metaDescTag[0].match(/content\s*=\s*["']([^"']*)["']/i);
    if (cm) description = cm[1].trim();
  }
  const stylesheets = [];
  const linkRe = /<link[^>]*>/gi;
  let m;
  while ((m = linkRe.exec(head))) {
    const tag = m[0];
    if (!/\brel\s*=\s*["']stylesheet["']/i.test(tag)) continue;
    const hm = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if (!hm) continue;
    stylesheets.push(resolveAppPath(hm[1], relFile, "asset"));
  }
  return { title, description, stylesheets };
}

function walkCopyCss(dir) {
  const skip = new Set(["node_modules", ".git", ".next", "next-site"]);
  for (const name of fs.readdirSync(dir)) {
    if (skip.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      walkCopyCss(full);
      continue;
    }
    if (path.extname(name).toLowerCase() !== ".css") continue;
    const rel = path.relative(SITE_ROOT, full);
    const dest = path.join(PUBLIC, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(full, dest);
  }
}

function walkCopyAssets(dir) {
  const skip = new Set(["node_modules", ".git", ".next", "next-site"]);
  for (const name of fs.readdirSync(dir)) {
    if (skip.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      walkCopyAssets(full);
      continue;
    }
    const ext = path.extname(name).toLowerCase();
    if (!ASSET_EXT.has(ext)) continue;
    const rel = path.relative(SITE_ROOT, full);
    /** Root favicon must not live in `public/` — conflicts with App Router `src/app/favicon.ico`. */
    if (posix(rel) === "favicon.ico") continue;
    const dest = path.join(PUBLIC, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(full, dest);
  }
}

/** Remove stale copy from before we skipped favicon in walkCopyAssets. */
function removePublicFaviconIfPresent() {
  const p = path.join(PUBLIC, "favicon.ico");
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log("Removed public/favicon.ico (App Router uses src/app/favicon.ico)");
  }
}

function copyLegacyJs() {
  fs.mkdirSync(LEGACY_JS, { recursive: true });
  const pairs = [
    ["navbar.js", "navbar.js"],
    ["script.js", "script.js"],
    ["footer-email.js", "footer-email.js"],
    ["career-inline.js", "career-inline.js"],
    ["contact-inline.js", "contact-inline.js"],
    [path.join("Projects", "script.js"), "projects-script.js"],
  ];
  for (const [srcName, destName] of pairs) {
    const src = path.join(SITE_ROOT, srcName);
    if (!fs.existsSync(src)) continue;
    fs.copyFileSync(src, path.join(LEGACY_JS, destName));
  }
}

function writeHomeInline() {
  const idx = fs.readFileSync(path.join(HTML_SOURCE, "index.html"), "utf8");
  const marker = '<script src="./navbar.js"';
  const i = idx.indexOf(marker);
  const slice = i === -1 ? "" : idx.slice(0, i);
  const m = slice.match(/<script>([\s\S]*?)<\/script>(?:\s*)$/i);
  if (!m) {
    console.warn("home-inline: could not extract inline script before navbar.js");
    fs.writeFileSync(
      path.join(LEGACY_JS, "home-inline.js"),
      "// empty: inline block not found\n",
      "utf8"
    );
    return;
  }
  fs.writeFileSync(path.join(LEGACY_JS, "home-inline.js"), m[1].trim() + "\n", "utf8");
}

function mirrorTermsPublicCss() {
  const cssSrc = path.join(SITE_ROOT, "t&c", "style.css");
  const cssDest = path.join(PUBLIC, "terms-and-conditions", "style.css");
  if (!fs.existsSync(cssSrc)) return;
  fs.mkdirSync(path.dirname(cssDest), { recursive: true });
  fs.copyFileSync(cssSrc, cssDest);
}

function ensureTermsImages() {
  const srcDir = path.join(SITE_ROOT, "t&c", "Images");
  const destDir = path.join(PUBLIC, "terms-and-conditions", "Images");
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    const s = path.join(srcDir, name);
    if (!fs.statSync(s).isFile()) continue;
    fs.copyFileSync(s, path.join(destDir, name));
  }
}

function main() {
  fs.mkdirSync(BODIES_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC, { recursive: true });

  console.log("Copying media assets…");
  walkCopyAssets(SITE_ROOT);
  removePublicFaviconIfPresent();

  console.log("Copying CSS…");
  walkCopyCss(SITE_ROOT);

  console.log("Copying legacy JS…");
  copyLegacyJs();
  writeHomeInline();
  ensureTermsImages();
  mirrorTermsPublicCss();

  const pageConfigMap = {};
  for (const page of PAGES) {
    const srcPath = path.join(HTML_SOURCE, page.rel);
    if (!fs.existsSync(srcPath)) {
      console.warn("Missing HTML source (legacy-html/):", page.rel);
      continue;
    }
    const raw = fs.readFileSync(srcPath, "utf8");
    const headMeta = extractHeadMeta(raw, posix(page.rel));
    let body = extractBodyInner(raw);
    body = stripScripts(body);
    body = rewriteAttrs(body, posix(page.rel));
    fs.writeFileSync(path.join(BODIES_DIR, `${page.slug}.html`), body, "utf8");
    pageConfigMap[page.slug] = {
      slug: page.slug,
      source: page.rel,
      scripts: page.scripts,
      ...headMeta,
    };
    console.log("Wrote body:", page.slug);
  }

  fs.mkdirSync(path.dirname(PAGE_CONFIG), { recursive: true });
  fs.writeFileSync(PAGE_CONFIG, JSON.stringify(pageConfigMap, null, 2), "utf8");
  console.log("Done. Wrote", PAGE_CONFIG);
}

main();
