import "./globals.css";

/** Favicon: use `src/app/favicon.ico` only. Do not add `public/favicon.ico` — Next reports a route conflict and dev manifests can corrupt. */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://tulaproperties.in" />
      </head>
      <body>{children}</body>
    </html>
  );
}
