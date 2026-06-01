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

Set the Vercel project **Root Directory** to **`next-site`**, then default **Install** / **Build** (`npm run build` runs `prepare:legacy` via `prebuild`).
