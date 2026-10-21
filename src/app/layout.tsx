import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wimvanesch.nl"),
  title: {
    default: "Wim van Esch — Fotografie",
    template: "%s — Wim van Esch",
  },
  description: "Natuur-, landschap- en portretfotografie van Wim van Esch.",
  openGraph: {
    title: "Wim van Esch — Fotografie",
    description: "Natuur-, landschap- en portretfotografie van Wim van Esch.",
    images: ["/photos/vogels/b46p9945.jpg"],
    locale: "nl_NL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070707",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body className={`${serif.variable} ${sans.variable}`}>
        <SmoothScroll />
        <Nav />
        {children}
        <Cursor />
        <div className="vignette" aria-hidden />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
