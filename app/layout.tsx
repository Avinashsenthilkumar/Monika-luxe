import type { Metadata, Viewport } from "next";
import "./globals.css";
import { instrument, manrope, plexMono } from "./fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ScrollProgress from "@/components/layout/ScrollProgress";
import LoadingScreen, { INTRO_SCRIPT } from "@/components/layout/LoadingScreen";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { company, siteUrl } from "@/lib/content";
import { localBusinessJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Monika Luxe — Luxury Interiors & Construction in Thanjavur",
    template: "%s | Monika Luxe",
  },
  description:
    "Monika Luxe Construction & Interiors — premium interior design, modular kitchens, construction, renovation and turnkey projects in Thanjavur, Tamil Nadu.",
  applicationName: company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: company.name,
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#06122a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${instrument.variable} ${manrope.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
        <LoadingScreen />
        <SmoothScroll>
          <ScrollProgress />
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
