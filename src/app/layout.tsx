import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import BootSequence from "@/components/boot/BootSequence";
import ViewModeProvider from "@/components/layout/ViewModeProvider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "adilet",
  description: "personal website",
  alternates: {
    types: {
      "text/markdown": "/llms.txt",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <ViewModeProvider>
          <BootSequence />
          {children}
        </ViewModeProvider>
      </body>
    </html>
  );
}
