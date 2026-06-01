/**
 * If `content/` was never generated (e.g. `next dev` run without `npm run prepare`),
 * run a full prepare once so the app can boot.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const cfg = path.join(root, "content", "page-config.json");
const homeBody = path.join(root, "content", "bodies", "home.html");
const sampleAsset = path.join(root, "public", "Images", "logo.png");
/** Duplicates `src/app/favicon.ico` and breaks dev (manifest / chunk errors). */
const strayPublicFavicon = path.join(root, "public", "favicon.ico");

if (fs.existsSync(strayPublicFavicon)) {
  fs.unlinkSync(strayPublicFavicon);
  console.warn(
    "[ensure-content] Removed public/favicon.ico (App Router uses src/app/favicon.ico)."
  );
}

if (!fs.existsSync(cfg) || !fs.existsSync(homeBody) || !fs.existsSync(sampleAsset)) {
  console.warn(
    "[ensure-content] Missing content or public assets — running prepare:legacy…"
  );
  const r = spawnSync(process.execPath, [path.join(root, "scripts", "prepare-legacy.mjs")], {
    cwd: root,
    stdio: "inherit",
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}
