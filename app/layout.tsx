import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KBcompare",
  description: "KBcompare is a keyboard comparison site with a scalable catalog, richer specs, and a first verified batch of official product images.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
