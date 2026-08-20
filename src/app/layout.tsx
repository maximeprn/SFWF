import type { Metadata, Viewport } from "next";
import { Arimo, Baloo_2, Beth_Ellen } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { BlobDefs } from "@/components/ui/BlobDefs";
import { BloomLayer } from "@/components/background/BloomLayer";
import { Chrome } from "@/components/chrome/Chrome";
import { Footer } from "@/components/chrome/Footer";
import { BackToTop } from "@/components/chrome/BackToTop";
import { PressSystem } from "@/components/chrome/PressSystem";
import { DYE_TEXTURE } from "@/content/photos";
import { FESTIVAL_DATES, SITE, SITE_URL } from "@/content/site";
import "./globals.css";

/* Three Google faces, all free for commercial use — which is what retired the festival's
   unlicensed display face. Beth Ellen is the script; Arimo carries prose and everything
   inside a bubble; Baloo 2 is primary buttons only. Meta lines use the system mono stack
   and load nothing. */
const bethEllen = Beth_Ellen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-beth-ellen-src",
  display: "swap",
});

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-arimo-src",
  display: "swap",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-baloo-src",
  display: "swap",
});

/* GA4. Read at build time — `NEXT_PUBLIC_` values are inlined, so this has to be the whole
   `process.env.NEXT_PUBLIC_GA_ID` expression and not a destructure. Unset means no tag and no
   requests to Google at all, which is what every local `npm run dev` and every preview
   deployment should be: the measurement ID belongs to production only. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const TITLE = `${SITE.name} — Ani sang Siargao, the six-day journey, ${FESTIVAL_DATES.label}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: SITE.description,
    type: "website",
    locale: "en_PH",
    siteName: SITE.name,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#4F3F79",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bethEllen.variable} ${arimo.variable} ${baloo.variable}`}
    >
      <head>
        {/* The dye is the first thing on screen and nothing in the markup reveals it — it
            is fetched from JS, remapped on a canvas, and handed to WebGL as a texture.
            Without this the browser can't discover it until the bundle has parsed.
            `crossOrigin` has to match the request dyeGround makes, or the preload lands in
            a separate cache entry and the image is fetched twice. */}
        <link
          rel="preload"
          as="image"
          href={DYE_TEXTURE}
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        {/* Mux serves the film from two hosts and the poster from a third, none of them this
            origin — so the first request to each pays DNS, TCP and TLS before it can ask for
            anything. These open the doors while the page is still parsing. `image` is the
            poster, which every visitor loads; `stream` is the film's master playlist, which
            only a press needs but which `useWarmStream` reaches for during idle.
            The regional `manifest-*.fastly.mux.com` behind `stream` cannot be named here —
            it is chosen per viewer, and warming it is exactly what that hook's second fetch
            is for. */}
        <link rel="preconnect" href="https://image.mux.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://stream.mux.com" crossOrigin="anonymous" />
      </head>
      <body>
        <BlobDefs />
        <BloomLayer />
        <PressSystem />
        {/* The page sits on z-index 1; the dye is fixed at 0 underneath. `Chrome` owns the
            band, the menu and the masked scroller — the three things that share one piece
            of state — and renders the page inside its own <main>. */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Chrome>{children}</Chrome>
          <Footer />
        </div>
        <BackToTop />
        {/* Last in the body, and `afterInteractive` inside the component — the dye, the fonts
            and the programme all load ahead of it. GA4's own enhanced measurement covers the
            page_view; there is one route here, so there is nothing else to send. */}
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}
