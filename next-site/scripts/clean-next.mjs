/**
 * Remove Next.js build output to fix corrupt webpack chunks
 * ("Cannot find module './611.js'" / missing _document chunks on Windows).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

for (const name of [".next", "out"]) {
  const p = path.join(root, name);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true, maxRetries: 3 });
    console.log("Removed", name);
  }
}
