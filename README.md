# Tula Properties — site

**Stack:** [Next.js 15](https://nextjs.org/) (App Router, `output: "export"`) in **`next-site/`**, with legacy page markup stored as HTML and rendered at build/runtime.

GitHub’s language bar counts **lines per file type**. This repo intentionally tracks a lot of **`.html`** (`legacy-html/`, generated `content/bodies/`), so Linguist shows **HTML** heavily even though routing, metadata, and tooling are **Next.js + TypeScript**. See **`.gitattributes`** for how we adjust those stats.

## Where to work

| Path | Role |
|------|------|
| **`next-site/`** | Next app: `src/app`, `next.config.ts`, `package.json` |
| **`next-site/legacy-html/`** | Source HTML for the prepare pipeline |
| **`next-site/content/`** | Generated bodies + `page-config.json` (from `npm run prepare:legacy`) |
| **Repo root** | Shared static assets + `navbar.js`, `style-main.css`, etc. (consumed by prepare) |

From the repo root:

```bash
npm install --prefix next-site
npm run dev
npm run build
```

Details: **`next-site/README.md`**.

## Deploy (e.g. Vercel)

**Recommended:** **Settings → General → Root Directory** = **`next-site`**. Vercel then uses **`next-site/package.json`**, **`next-site/vercel.json`**, and installs into **`next-site/node_modules`** (where **`next`** lives).

**If Root Directory is left as the repo root** (`.`), Vercel’s default **`npm install`** only sees the **root** `package.json`, which has **no** `next` / `react` dependencies — so **`next-site/node_modules/next`** is never created and the build fails with **`Cannot find module '.../next-site/node_modules/next/dist/bin/next'`**. The repo root **`vercel.json`** fixes that case by running **`npm install --prefix next-site`** and **`npm run build --prefix next-site`**, with **`outputDirectory`** set to **`next-site/out`** for static export.

1. Prefer **Root Directory** = **`next-site`** (simpler; matches how you run **`npm install --prefix next-site`** locally).

2. Commit and push **`next-site/package-lock.json`**.

3. With Root = **`next-site`**, **`next-site/vercel.json`** runs **`npm install --no-audit --no-fund && npm run build`** before the Next build (helps if install was skipped or cache was bad). Clear **Build cache** once after changing deploy settings.

4. Leave dashboard **Install** / **Build** overrides empty unless you know you need them, so **`vercel.json`** applies.

The **`next-site`** **`build`** script is **`next build`** (runs after dependencies exist).
