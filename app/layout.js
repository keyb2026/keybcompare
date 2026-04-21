import "./globals.css";

export const metadata = {
  title: "KBcompare",
  description: "Compare keyboards side by side."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
