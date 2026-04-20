import React, { useMemo, useState } from 'react';

const keyboards = [
  {
    id: 'wooting-80he',
    brand: 'Wooting',
    name: '80HE',
    size: '80%',
    layout: 'ANSI',
    connection: ['USB-C'],
    wireless: false,
    switchType: 'Hall Effect',
    hotSwap: true,
    rapidTrigger: true,
    mounting: 'Gasket',
    caseMaterial: 'Plastic',
    plateMaterial: 'Steel',
    keycapMaterial: 'PBT',
    backlight: 'Per-key RGB',
    pollingRate: 8000,
    latencyMs: 0.3,
    weightG: 790,
    dimensions: '346 x 142 x 37 mm',
    software: 'Wootility',
    price: 199,
    knob: false,
    display: false,
    soundProfile: 'Clacky',
    notes: 'Competitive-focused hall effect keyboard with rapid trigger.'
  },
  {
    id: 'drunkdeer-a75-pro',
    brand: 'DrunkDeer',
    name: 'A75 Pro',
    size: '75%',
    layout: 'ANSI',
    connection: ['USB-C'],
    wireless: false,
    switchType: 'Hall Effect',
    hotSwap: true,
    rapidTrigger: true,
    mounting: 'Tray',
    caseMaterial: 'Plastic',
    plateMaterial: 'Aluminum',
    keycapMaterial: 'PBT',
    backlight: 'Per-key RGB',
    pollingRate: 8000,
    latencyMs: 0.5,
    weightG: 960,
    dimensions: '333 x 139 x 41 mm',
    software: 'DrunkDeer Driver',
    price: 139,
    knob: false,
    display: false,
    soundProfile: 'Bright',
    notes: 'Value-oriented hall effect board for gaming.'
  },
  {
    id: 'razer-huntsman-v3-pro-tkl',
    brand: 'Razer',
    name: 'Huntsman V3 Pro TKL',
    size: 'TKL',
    layout: 'ANSI',
    connection: ['USB-C'],
    wireless: false,
    switchType: 'Analog Optical',
    hotSwap: false,
    rapidTrigger: true,
    mounting: 'Tray',
    caseMaterial: 'Aluminum',
    plateMaterial: 'Aluminum',
    keycapMaterial: 'Doubleshot PBT',
    backlight: 'Per-key RGB',
    pollingRate: 8000,
    latencyMs: 0.4,
    weightG: 920,
    dimensions: '364 x 139 x 39 mm',
    software: 'Synapse',
    price: 219,
    knob: true,
    display: false,
    soundProfile: 'Sharp',
    notes: 'Fast esports-oriented TKL with analog optical switches.'
  },
  {
    id: 'steelseries-apex-pro-tkl-wireless',
    brand: 'SteelSeries',
    name: 'Apex Pro TKL Wireless (2023)',
    size: 'TKL',
    layout: 'ANSI',
    connection: ['2.4 GHz', 'Bluetooth', 'USB-C'],
    wireless: true,
    switchType: 'Magnetic',
    hotSwap: false,
    rapidTrigger: true,
    mounting: 'Tray',
    caseMaterial: 'Aluminum',
    plateMaterial: 'Aluminum',
    keycapMaterial: 'PBT',
    backlight: 'Per-key RGB',
    pollingRate: 1000,
    latencyMs: 1.2,
    weightG: 1070,
    dimensions: '355 x 128 x 42 mm',
    software: 'GG',
    price: 249,
    knob: false,
    display: true,
    soundProfile: 'Muted',
    notes: 'Wireless magnetic TKL with display and gaming features.'
  },
  {
    id: 'logitech-g-pro-x-tkl-rapid',
    brand: 'Logitech',
    name: 'G Pro X TKL Rapid',
    size: 'TKL',
    layout: 'ANSI',
    connection: ['USB-C'],
    wireless: false,
    switchType: 'Magnetic',
    hotSwap: false,
    rapidTrigger: true,
    mounting: 'Tray',
    caseMaterial: 'Plastic',
    plateMaterial: 'Steel',
    keycapMaterial: 'PBT',
    backlight: 'LIGHTSYNC RGB',
    pollingRate: 1000,
    latencyMs: 0.7,
    weightG: 1120,
    dimensions: '357 x 150 x 38 mm',
    software: 'G HUB',
    price: 179,
    knob: false,
    display: false,
    soundProfile: 'Firm',
    notes: 'Tournament-friendly magnetic keyboard with simple layout.'
  },
  {
    id: 'keychron-q1-max',
    brand: 'Keychron',
    name: 'Q1 Max',
    size: '75%',
    layout: 'ANSI / ISO',
    connection: ['2.4 GHz', 'Bluetooth', 'USB-C'],
    wireless: true,
    switchType: 'Mechanical',
    hotSwap: true,
    rapidTrigger: false,
    mounting: 'Gasket',
    caseMaterial: 'Aluminum',
    plateMaterial: 'PC',
    keycapMaterial: 'PBT',
    backlight: 'South-facing RGB',
    pollingRate: 1000,
    latencyMs: 3.1,
    weightG: 1724,
    dimensions: '328 x 145 x 23 mm',
    software: 'VIA / Launcher',
    price: 209,
    knob: true,
    display: false,
    soundProfile: 'Thocky',
    notes: 'Premium enthusiast board with tri-mode connectivity.'
  },
  {
    id: 'monsgeek-m1w-v3',
    brand: 'MonsGeek',
    name: 'M1W V3 SP',
    size: '75%',
    layout: 'ANSI',
    connection: ['2.4 GHz', 'Bluetooth', 'USB-C'],
    wireless: true,
    switchType: 'Mechanical',
    hotSwap: true,
    rapidTrigger: false,
    mounting: 'Gasket',
    caseMaterial: 'Aluminum',
    plateMaterial: 'PC',
    keycapMaterial: 'PBT',
    backlight: 'Per-key RGB',
    pollingRate: 1000,
    latencyMs: 4.2,
    weightG: 1650,
    dimensions: '333 x 146 x 32 mm',
    software: 'VIA',
    price: 129,
    knob: true,
    display: false,
    soundProfile: 'Deep',
    notes: 'Value aluminum 75% custom-style board.'
  },
  {
    id: 'nuphy-halo75-v2',
    brand: 'NuPhy',
    name: 'Halo75 V2',
    size: '75%',
    layout: 'ANSI',
    connection: ['2.4 GHz', 'Bluetooth', 'USB-C'],
    wireless: true,
    switchType: 'Mechanical',
    hotSwap: true,
    rapidTrigger: false,
    mounting: 'Gasket',
    caseMaterial: 'Plastic + Aluminum',
    plateMaterial: 'PC',
    keycapMaterial: 'PBT',
    backlight: 'RGB + side glow',
    pollingRate: 1000,
    latencyMs: 3.6,
    weightG: 1260,
    dimensions: '333 x 145 x 34 mm',
    software: 'NuPhyIO',
    price: 149,
    knob: false,
    display: false,
    soundProfile: 'Poppy',
    notes: 'Stylish tri-mode 75% with enthusiast tuning.'
  },
  {
    id: 'asus-azoth',
    brand: 'ASUS',
    name: 'ROG Azoth',
    size: '75%',
    layout: 'ANSI',
    connection: ['2.4 GHz', 'Bluetooth', 'USB-C'],
    wireless: true,
    switchType: 'Mechanical',
    hotSwap: true,
    rapidTrigger: false,
    mounting: 'Gasket',
    caseMaterial: 'Aluminum',
    plateMaterial: 'Metal',
    keycapMaterial: 'PBT',
    backlight: 'Per-key RGB',
    pollingRate: 1000,
    latencyMs: 2.9,
    weightG: 1186,
    dimensions: '326 x 136 x 40 mm',
    software: 'Armoury Crate',
    price: 249,
    knob: true,
    display: true,
    soundProfile: 'Crisp',
    notes: 'Premium gaming 75% with OLED and strong build quality.'
  },
  {
    id: 'corsair-k70-max',
    brand: 'Corsair',
    name: 'K70 MAX',
    size: 'Full-size',
    layout: 'ANSI',
    connection: ['USB-C'],
    wireless: false,
    switchType: 'Magnetic',
    hotSwap: false,
    rapidTrigger: true,
    mounting: 'Tray',
    caseMaterial: 'Aluminum',
    plateMaterial: 'Aluminum',
    keycapMaterial: 'PBT',
    backlight: 'Per-key RGB',
    pollingRate: 8000,
    latencyMs: 0.8,
    weightG: 1390,
    dimensions: '445 x 166 x 39 mm',
    software: 'iCUE',
    price: 229,
    knob: true,
    display: false,
    soundProfile: 'Loud',
    notes: 'Full-size magnetic gaming keyboard with 8K polling.'
  },
  {
    id: 'akko-mod007b-he',
    brand: 'Akko',
    name: 'MOD007B HE',
    size: '75%',
    layout: 'ANSI',
    connection: ['2.4 GHz', 'Bluetooth', 'USB-C'],
    wireless: true,
    switchType: 'Hall Effect',
    hotSwap: true,
    rapidTrigger: true,
    mounting: 'Gasket',
    caseMaterial: 'Aluminum',
    plateMaterial: 'PC',
    keycapMaterial: 'PBT',
    backlight: 'Per-key RGB',
    pollingRate: 1000,
    latencyMs: 1.0,
    weightG: 1600,
    dimensions: '333 x 147 x 33 mm',
    software: 'Akko Cloud Driver',
    price: 189,
    knob: true,
    display: false,
    soundProfile: 'Dense',
    notes: 'Hall effect 75% with enthusiast-leaning construction.'
  }
];

const sections = [
  {
    title: 'Core',
    fields: [
      ['Brand', k => k.brand],
      ['Model', k => k.name],
      ['Size', k => k.size],
      ['Layout', k => k.layout],
      ['Connection', k => k.connection.join(', ')],
      ['Wireless', k => yesNo(k.wireless)],
      ['Switch type', k => k.switchType],
      ['Hot-swap', k => yesNo(k.hotSwap)],
      ['Rapid trigger', k => yesNo(k.rapidTrigger)]
    ]
  },
  {
    title: 'Build & feel',
    fields: [
      ['Mounting', k => k.mounting],
      ['Case material', k => k.caseMaterial],
      ['Plate material', k => k.plateMaterial],
      ['Keycap material', k => k.keycapMaterial],
      ['Sound profile', k => k.soundProfile],
      ['Knob', k => yesNo(k.knob)],
      ['Display', k => yesNo(k.display)]
    ]
  },
  {
    title: 'Performance',
    fields: [
      ['Polling rate', k => `${k.pollingRate} Hz`],
      ['Estimated latency', k => `${k.latencyMs} ms`],
      ['Backlight', k => k.backlight],
      ['Software', k => k.software],
      ['Weight', k => `${k.weightG} g`],
      ['Dimensions', k => k.dimensions],
      ['Price', k => `$${k.price}`]
    ]
  }
];

function yesNo(value) {
  return value ? 'Yes' : 'No';
}

function summaryText(selected) {
  if (selected.length < 2) return 'Pick at least two keyboards to generate a quick comparison summary.';
  const cheapest = [...selected].sort((a, b) => a.price - b.price)[0];
  const fastest = [...selected].sort((a, b) => a.latencyMs - b.latencyMs)[0];
  const lightest = [...selected].sort((a, b) => a.weightG - b.weightG)[0];
  return `${cheapest.brand} ${cheapest.name} is the cheapest at $${cheapest.price}. ${fastest.brand} ${fastest.name} is the fastest listed option at ${fastest.latencyMs} ms latency. ${lightest.brand} ${lightest.name} is the lightest at ${lightest.weightG} g.`;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(['wooting-80he', 'keychron-q1-max', 'razer-huntsman-v3-pro-tkl']);

  const sizes = [...new Set(keyboards.map(k => k.size))];

  const filtered = useMemo(() => {
    return keyboards.filter(k => {
      const text = `${k.brand} ${k.name} ${k.switchType} ${k.size} ${k.notes}`.toLowerCase();
      const matchQuery = text.includes(query.toLowerCase());
      const matchSize = sizeFilter === 'all' || k.size === sizeFilter;
      const matchTech =
        techFilter === 'all' ||
        (techFilter === 'he' && /hall|magnetic|analog/i.test(k.switchType)) ||
        (techFilter === 'wireless' && k.wireless) ||
        (techFilter === 'hotswap' && k.hotSwap);
      return matchQuery && matchSize && matchTech;
    });
  }, [query, sizeFilter, techFilter]);

  const selected = selectedIds.map(id => keyboards.find(k => k.id === id)).filter(Boolean);

  const toggleKeyboard = id => {
    setSelectedIds(current => {
      if (current.includes(id)) return current.filter(item => item !== id);
      if (current.length >= 4) return [...current.slice(1), id];
      return [...current, id];
    });
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <div className="eyebrow">KeybCompare</div>
          <h1>Compare computer keyboards side by side</h1>
          <p>
            Search gaming, custom, and productivity keyboards. Pick up to four boards and compare
            size, switches, connectivity, build, and performance in one clean table.
          </p>
        </div>
        <div className="hero-card">
          <h3>Quick summary</h3>
          <p>{summaryText(selected)}</p>
          <div className="pill-row">
            <span className="pill">Free Vercel-ready site</span>
            <span className="pill">Affiliate-ready layout</span>
            <span className="pill">Easy to expand</span>
          </div>
        </div>
      </header>

      <section className="feature-grid">
        <div className="feature-box"><strong>Search catalog</strong><span>Filter by size, switch tech, and features.</span></div>
        <div className="feature-box"><strong>Compare 4 at once</strong><span>See the differences instantly in one view.</span></div>
        <div className="feature-box"><strong>Monetize later</strong><span>Add affiliate buttons, SEO pages, and rankings.</span></div>
      </section>

      <main className="main-grid">
        <aside className="sidebar card">
          <h2>Browse keyboards</h2>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input"
            placeholder="Search brand, model, switch tech..."
          />

          <label className="label">Size</label>
          <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)} className="input">
            <option value="all">All sizes</option>
            {sizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          <label className="label">Feature focus</label>
          <select value={techFilter} onChange={e => setTechFilter(e.target.value)} className="input">
            <option value="all">All keyboards</option>
            <option value="he">Hall Effect / Magnetic</option>
            <option value="wireless">Wireless</option>
            <option value="hotswap">Hot-swap</option>
          </select>

          <div className="catalog">
            {filtered.map(k => {
              const active = selectedIds.includes(k.id);
              return (
                <button key={k.id} className={`catalog-item ${active ? 'active' : ''}`} onClick={() => toggleKeyboard(k.id)}>
                  <div className="catalog-top">
                    <strong>{k.brand} {k.name}</strong>
                    <span>{active ? 'Selected' : 'Add'}</span>
                  </div>
                  <div className="pill-row">
                    <span className="pill small">{k.size}</span>
                    <span className="pill small">{k.switchType}</span>
                    <span className="pill small">${k.price}</span>
                  </div>
                  <p>{k.notes}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="content">
          <div className="card selected-card">
            <h2>Selected keyboards</h2>
            <div className="selected-grid">
              {selected.map(k => (
                <div key={k.id} className="selected-item">
                  <strong>{k.brand} {k.name}</strong>
                  <div className="muted">{k.size} · {k.switchType} · ${k.price}</div>
                </div>
              ))}
            </div>
          </div>

          {sections.map(section => (
            <div className="card table-card" key={section.title}>
              <h2>{section.title}</h2>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      {selected.map(k => <th key={k.id}>{k.brand} {k.name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {section.fields.map(([label, getter]) => (
                      <tr key={label}>
                        <td>{label}</td>
                        {selected.map(k => <td key={`${k.id}-${label}`}>{getter(k)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
