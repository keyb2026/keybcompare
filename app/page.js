const keyboards = [
  { brand: 'Wooting', name: '80HE', size: '80%', sound: 'Clacky' },
  { brand: 'Keychron', name: 'Q1 Max', size: '75%', sound: 'Thocky' },
  { brand: 'Razer', name: 'Huntsman V3 Pro TKL', size: 'TKL', sound: 'Sharp' }
]

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>KBcompare</h1>
      <p style={{ color: '#d1d5db', marginBottom: 24 }}>
        Stable base build for your keyboard comparison site.
      </p>
      <section style={{ display: 'grid', gap: 16 }}>
        {keyboards.map((k) => (
          <article
            key={k.brand + k.name}
            style={{ border: '1px solid #374151', borderRadius: 12, padding: 16, background: '#1f2937' }}
          >
            <div style={{ fontSize: 14, color: '#9ca3af' }}>{k.brand}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{k.name}</div>
            <div style={{ marginTop: 8, color: '#d1d5db' }}>Size: {k.size}</div>
            <div style={{ color: '#d1d5db' }}>Sound: {k.sound}</div>
          </article>
        ))}
      </section>
    </main>
  )
}
