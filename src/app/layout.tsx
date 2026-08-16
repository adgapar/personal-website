import type { Metadata } from "next";
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
