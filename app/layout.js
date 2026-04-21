import "./globals.css";
export const metadata = { title: "KBcompare", description: "Compare 135 keyboard models side by side." };
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}