A Next.js version of this site lives in **`next-site/`**. Page HTML lives in **`next-site/legacy-html/`**; images, CSS, and root scripts stay in the repo root next to `next-site/`. See **`next-site/README.md`** for full detail.

**Run from repo root** (`C:\Cursor\htaccess`): `npm run dev` — a root `package.json` forwards into `next-site/`.

**Or** from **`next-site`**: `cd next-site` then `npm run dev`.

**Local URL:** open **http://localhost:3000** (or the port shown in the terminal). If you see Next’s black “404” page, another app may be using port 3000 — from `next-site` use `npm run dev:3050` or the URL Next prints.
