import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Mono, JetBrains_Mono } from "next/font/google";
import BootSequence from "@/components/boot/BootSequence";
import ViewModeProvider from "@/components/layout/ViewModeProvider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

// candidates, for comparing on the real page
const geistMono = Geist_Mono({ variable: "--font-geist", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} ${geistMono.variable} ${plexMono.variable} antialiased`}
        style={{ ["--font-mono" as string]: "var(--font-jetbrains)" }}
      >
        <ViewModeProvider>
          <BootSequence />
          {children}
        </ViewModeProvider>
      </body>
    </html>
  );
}
