import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KBcompare",
  description: "KBcompare is a keyboard comparison site with 135 starter models, deeper specs, and official-page image importing for supported product links.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
