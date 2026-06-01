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

1. **Settings → General → Root Directory** = **`next-site`**. If this is wrong, **`next` never installs** and you get **`Cannot find module '.../next/dist/bin/next'`** or **`next: command not found`**.

2. Commit and push **`next-site/package-lock.json`**.

3. **`next-site/vercel.json`** sets **`buildCommand`** to **`npm install --no-audit --no-fund && npm run build`** so dependencies are installed again immediately before the Next build (covers skipped installs or bad cache). Clear **Build cache** in Vercel once after changing this.

4. Leave the Vercel dashboard **Build Command** empty so **`vercel.json`** is used.

The **`package.json`** **`build`** script is **`next build`** again (normal after install).
