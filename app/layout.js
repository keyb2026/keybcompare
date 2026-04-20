export const metadata = {
  title: 'KBcompare',
  description: 'Keyboard comparison site'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#111827', color: '#f9fafb' }}>
        {children}
      </body>
    </html>
  )
}
