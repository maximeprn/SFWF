import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { BlobDefs } from "@/components/ui/BlobDefs";
import { SiteShell } from "@/components/chrome/SiteShell";
import { FESTIVAL_DATES, SITE } from "@/content/site";
import "./globals.css";

/* The festival's real faces, supplied Aug 2026. The variable cut covers 300–700, which is
   every weight the design uses, in one file. */
const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.ttf",
  weight: "300 700",
  variable: "--font-satoshi-src",
  display: "swap",
});

const wigglye = localFont({
  src: "../fonts/Wigglye-Regular.ttf",
  weight: "400",
  variable: "--font-wigglye-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://siargaofoodfest.com"),
  title: {
    default: `${SITE.name} — ${FESTIVAL_DATES.label}`,
    template: `%s · ${SITE.shortName}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${FESTIVAL_DATES.label}`,
    description: SITE.description,
    type: "website",
    locale: "en_PH",
    siteName: SITE.name,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b1420",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Hides the page for a first-time visitor before paint, so the loading seal doesn't flash
 * the content behind it. Content is still fully server-rendered — this only affects
 * opacity, so crawlers and reader modes are unaffected.
 */
const NO_FLASH = `try{if(!sessionStorage.getItem('sfwf-entered'))document.documentElement.classList.add('sfwf-loading')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* suppressHydrationWarning: the no-flash script below adds `sfwf-loading` to <html>
       before React hydrates, so the class list legitimately differs from the server's. The
       suppression is one level deep and does not reach the page content. */
    <html
      lang="en"
      className={`${satoshi.variable} ${wigglye.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body>
        <BlobDefs />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
