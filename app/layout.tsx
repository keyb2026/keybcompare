import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KeybCompare",
  description: "Keyboard comparison site with a scalable catalog and image-ready cards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
