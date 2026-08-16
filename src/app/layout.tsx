import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import BootSequence from "@/components/boot/BootSequence";
import ViewModeProvider from "@/components/layout/ViewModeProvider";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // absolute URLs for Open Graph and canonicals are derived from this
  metadataBase: new URL("https://adilet.fyi"),
  title: {
    default: "adilet",
    template: "%s — adilet",
  },
  description:
    "Adilet Gaparov — founding AI engineer at Orbio AI. Writing about AI reliability, agents, and building in public.",
  alternates: {
    types: {
      "text/markdown": "/llms.txt",
    },
  },
  openGraph: {
    type: "website",
    siteName: "adilet.fyi",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@adgapar",
  },
};

/**
 * Stated rather than left to the default, because two of these are load-bearing
 * on a phone and the terminal is unusable without them.
 *
 * `interactiveWidget: resizes-content` is the important one. The desktop is a
 * fixed, non-scrolling surface with the prompt pinned at the bottom of the
 * window; when the on-screen keyboard opens, the default (`resizes-visual`)
 * leaves the layout viewport at full height and simply slides the keyboard over
 * the bottom third — which is exactly where the thing you are typing into is.
 * Resizing the content instead means the window shortens and the prompt stays
 * above the keys.
 *
 * `viewportFit: cover` lets the window reach into the notch and home-bar areas,
 * which is what a full-screen app does; the insets are paid back as padding on
 * the bars that need it.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        <ViewModeProvider>
          <BootSequence />
          {children}
        </ViewModeProvider>
      </body>
    </html>
  );
}
