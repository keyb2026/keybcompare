import "./globals.css";

export const metadata = {
  title: "KBcompare",
  description: "Clean stable keyboard comparison site"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}