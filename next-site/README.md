# Tula Properties — Next.js migration

This folder is a **Next.js 15 (App Router)** build that mirrors the static HTML site in the parent directory (`../`). The original markup, CSS, images, and vanilla JS behavior are preserved using:

- **Server-rendered HTML** from `content/bodies/*.html` (generated)
- **Per-page CSS** and **Google Fonts** via `<link>` in the server-rendered page (same URLs as the static site)
- **Loading:** page + `navbar.css` first with `fetchPriority`; Google Fonts CSS deferred until after first paint; legacy JS preloaded and started on `requestIdleCallback` (with RAF fallback) so layout can settle first
- **Legacy scripts** copied to `public/legacy-js/` (`navbar.js`, `script.js`, `footer-email.js`, etc.)
- **Full page navigation** on internal links so legacy event listeners do not stack between routes

## Prerequisites

The prepare step reads **HTML** from **`next-site/legacy-html/`** (mirrors old paths like `contact/index.html`). It still reads **images, videos, CSS, and root `*.js`** from **`..` (repo root)** — keep `Images/`, `Icons/`, `videos/`, section folders for `style.css` / `Images/`, and `navbar.js`, `script.js`, `footer-email.js`, `Projects/script.js` next to `next-site/`.

## Commands

```bash
cd next-site
npm install
npm run clean
npm run dev
```

Use the **Local:** URL from the terminal (often `http://localhost:3000`). If the tab stays blank or errors, run **`npm run prepare:legacy`** once (copies assets from the parent folder — can take a few minutes) then **`npm run dev`** again.

Do **not** start the app with plain `next dev` from a GUI unless `content/page-config.json` already exists — use **`npm run dev`** so missing `content/` is auto-generated.

```bash
npm run build
npm run start
```

With `output: "export"`, **`next start` is not supported** — `npm run start` serves the **`out/`** folder with a static server (same as production static hosting).

### “404 | This page could not be found” on localhost

That screen is Next’s **real 404** — usually you are **not** talking to this project’s dev server:

1. Run dev **from this folder**: `cd next-site` then `npm run dev` (not from `htaccess` root).
2. Use the **exact** “Local:” URL from the terminal (not always `:3000` if something else is using it).
3. Stop other Node/Next processes on 3000, or use `npm run dev:3050`.
4. Do **not** use `next start` alone after a static export; use `npm run start` (serves `out/`) or `npm run dev` while developing.

### `Cannot find module './611.js'` or `_document` / webpack-runtime errors

Usually a **stale or corrupt `.next` folder** (common on Windows after many dev runs). Fix:

```bash
npm run clean
npm run dev
```

For a fresh production bundle: **`npm run build:clean`**. If dev shows **`pages-manifest.json`**, **`middleware-manifest.json`**, or **`routes-manifest.json`** ENOENT after errors, stop the server and run **`npm run dev:reset`** (clean + dev).

**`next.config.ts`:** dev uses webpack **memory** cache; production sets **`cache: false`** to reduce missing `./NNN.js` chunks on Windows (prod builds are a bit slower).

### Favicon conflict (`conflicting public file and page file` for `/favicon.ico`)

The app must use **`src/app/favicon.ico` only**. **`prepare:legacy`** no longer copies a root **`favicon.ico`** into **`public/`** (that duplicate broke dev and led to manifest / chunk errors). Run **`npm run prepare:legacy`** once after pulling this change so **`public/favicon.ico`** is removed if it was copied earlier.

`npm run build` runs **`prebuild`** → **`prepare:legacy`**. `npm run dev` runs **`ensure-content`** first (runs **`prepare:legacy`** only if `content/` is missing).

`prepare:legacy` then:
1. Copies images/videos and other assets from the repo root into `public/`
2. Copies all `.css` files into `public/` with the same paths (so `url(...)` in CSS keeps working)
3. Copies legacy JS into `public/legacy-js/`
4. Writes `content/bodies/<slug>.html` and `content/page-config.json`

Output of `next build` with `output: "export"` is the **`out/`** folder (static files you can host on any static host or behind Apache/Nginx).

## URL map (vs old `.html` paths)

| New route | Former file |
|-----------|----------------|
| `/` | `index.html` |
| `/contact` | `contact/index.html` |
| `/soil` | `soil/index.html` |
| `/eco-urbanity` | `eco-urbanity/index.html` |
| `/design-prospects` | `design-prospects/index.html` |
| `/channel-partners` | `channel-partners/index.html` |
| `/career` | `career/index.html` |
| `/leadership` | `leadership/index.html` |
| `/Projects` | `Projects/index.html` |
| `/Projects/rhythms-of-earth` | `Projects/rhythms-of-earth.html` |
| `/blogs` | `blogs/index.html` |
| `/blogs/blog1` | `blogs/blog1.html` |
| `/blogs/blogs2` | `blogs/blogs2.html` |
| `/blogs/blogs3` | `blogs/blogs3.html` |
| `/privacy-policy` | `privacy-policy/index.html` |
| `/disclaimer` | `disclaimer/index.html` |
| `/terms-and-conditions` | `t&c/index.html` |

Configure **301 redirects** from old URLs (e.g. `/contact/index.html` → `/contact`) on your host; `output: "export"` does not run server redirects.

## Next steps (optional hardening)

- Port `navbar.js` / forms to React **client components** and use **`<Link prefetch={false}>`** so you can drop full-page reloads.
- Move lead API calls to a **Route Handler** to avoid CORS and hide endpoints if needed.
- Remove `reactStrictMode: false` once legacy scripts are scoped with proper teardown.
