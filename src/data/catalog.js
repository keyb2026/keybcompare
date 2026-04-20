const brandModels = {
  Logitech: ['G Pro X TKL Rapid', 'G915 X', 'G915 TKL', 'G715', 'G512', 'G413 SE', 'MX Mechanical', 'MX Mechanical Mini'],
  Razer: ['Huntsman V3 Pro Mini', 'Huntsman V3 Pro TKL', 'Huntsman V3 Pro', 'BlackWidow V4 75%', 'BlackWidow V4 Pro', 'BlackWidow V4 X', 'DeathStalker V2 Pro', 'Ornata V3'],
  Corsair: ['K70 MAX', 'K70 RGB PRO', 'K70 CORE', 'K65 PLUS Wireless', 'K65 RGB MINI', 'K100 RGB', 'K55 CORE', 'K100 AIR Wireless'],
  SteelSeries: ['Apex Pro Mini', 'Apex Pro TKL', 'Apex Pro TKL Wireless', 'Apex Pro', 'Apex 9 Mini', 'Apex 9 TKL', 'Apex 7 TKL', 'Apex 5'],
  ASUS: ['ROG Azoth', 'ROG Azoth Extreme', 'ROG Falchion RX Low Profile', 'ROG Strix Scope II 96 Wireless', 'ROG Strix Scope II 96 RX Wireless', 'ROG Strix Scope II', 'ROG Claymore II', 'TUF Gaming K3 Gen II'],
  Keychron: ['Q1 Max', 'Q3 Max', 'Q6 Max', 'Q1 HE', 'K2 HE', 'K8 Max', 'V1 Max', 'V6 Max', 'C3 Pro', 'Q1 Pro'],
  Wooting: ['60HE+', '80HE', 'Two HE', 'UwU RGB'],
  Akko: ['MOD007B HE', '5075B Plus', 'MU01', '3084B Plus', '5075S VIA', 'MonsGeek FUN60 Pro', 'SPR67', '3087 DS'],
  NuPhy: ['Halo75 V2', 'Air75 V2', 'Field75 HE', 'Gem80', 'Halo96 V2', 'Air60 V2', 'Nos75', 'Kick75'],
  Glorious: ['GMMK 3 Pro HE', 'GMMK 3 Pro', 'GMMK 3', 'GMMK 2 96%', 'GMMK 2 65%', 'GMMK Pro', 'GMMK Numpad'],
  Ducky: ['One 3 Mini', 'One 3 TKL', 'One 3 SF', 'One 3 Matcha', 'ProjectD Tinker65', 'Origin Vintage', 'Mecha Mini v2', 'Zero 6108'],
  Epomaker: ['TH80 Pro V2', 'Aula F75', 'RT100', 'Galaxy100', 'Shadow-X', 'P75', 'CIDOO ABM066', 'EK68'],
  HyperX: ['Alloy Rise', 'Alloy Origins 65', 'Alloy Origins Core', 'Alloy Elite 2', 'Alloy Rise 75', 'Alloy Origins', 'x Ducky One 2 Mini'],
  'Royal Kludge': ['RK61', 'RK68', 'RK84', 'R75', 'M75', 'S98', 'R87 Pro', 'RK100'],
  'Cooler Master': ['MK770', 'CK721', 'MK721', 'CK720', 'SK653', 'SK622', 'MK850', 'ControlPad'],
  MonsGeek: ['M1W V3', 'M1 V5', 'M3W HE', 'M5W', 'FUN60 Ultra', 'M1 QMK', 'M7W', 'M6'],
  Lemokey: ['P1 Pro', 'P1 HE', 'P3 Pro', 'L1', 'L3', 'X1', 'X3', 'P1'],
  DrunkDeer: ['A75 Pro', 'G65', 'G60', 'A75 Ultra', 'A75 Master', 'G75'],
  Gamakay: ['TK75', 'TK75 HE V2', 'LK67', 'SN75', 'TK68 HE', 'K61 Pro', 'LK75'],
  GravaStar: ['Mercury K1', 'Mercury K1 Pro', 'Mercury K1 Lite', 'Mercury V75', 'Mercury V75 Pro', 'Mercury V75 HE']
};

const sizes = ['60%', '65%', '75%', '80%', 'TKL', '96%', 'Full-size'];
const layouts = ['ANSI', 'ANSI / ISO'];
const mounts = ['Tray', 'Gasket', 'Top mount'];
const caseMaterials = ['Plastic', 'Aluminum', 'Plastic + Aluminum'];
const plateMaterials = ['Steel', 'Aluminum', 'PC', 'FR4'];
const keycaps = ['PBT', 'Doubleshot PBT', 'ABS'];
const backlights = ['Per-key RGB', 'South-facing RGB', 'White', 'None'];
const softwares = ['Web Driver', 'Desktop App', 'VIA', 'QMK / VIA', 'Cloud Driver'];
const soundProfiles = ['Clacky', 'Muted', 'Thocky', 'Firm', 'Bright', 'Creamy', 'Poppy'];

const techByBrand = {
  Logitech: 'Magnetic',
  Razer: 'Analog Optical',
  Corsair: 'Magnetic',
  SteelSeries: 'Magnetic',
  ASUS: 'Mechanical',
  Keychron: 'Mechanical',
  Wooting: 'Hall Effect',
  Akko: 'Mechanical',
  NuPhy: 'Mechanical',
  Glorious: 'Mechanical',
  Ducky: 'Mechanical',
  Epomaker: 'Mechanical',
  HyperX: 'Mechanical',
  'Royal Kludge': 'Mechanical',
  'Cooler Master': 'Mechanical',
  MonsGeek: 'Mechanical',
  Lemokey: 'Mechanical',
  DrunkDeer: 'Hall Effect',
  Gamakay: 'Mechanical',
  GravaStar: 'Mechanical'
};

const featureBrands = new Set(['Logitech', 'Razer', 'Corsair', 'SteelSeries', 'Wooting', 'DrunkDeer']);
const wirelessBrands = new Set(['Logitech', 'Razer', 'SteelSeries', 'ASUS', 'Keychron', 'NuPhy', 'Glorious', 'HyperX', 'Royal Kludge', 'Lemokey', 'GravaStar']);

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pick(arr, index) {
  return arr[index % arr.length];
}

function priceFor(brand, index) {
  const base = featureBrands.has(brand) ? 149 : 89;
  return base + (index % 6) * 20 + Math.floor(index / 3) * 5;
}

function sizeFor(model, index) {
  const lower = model.toLowerCase();
  if (lower.includes('mini') || lower.includes('60') || lower.includes('61')) return '60%';
  if (lower.includes('65') || lower.includes('68')) return '65%';
  if (lower.includes('75')) return '75%';
  if (lower.includes('80') || lower.includes('tkl') || lower.includes('87')) return 'TKL';
  if (lower.includes('96') || lower.includes('98') || lower.includes('100')) return '96%';
  if (lower.includes('full') || lower.includes('104') || lower.includes('108')) return 'Full-size';
  return pick(sizes, index);
}

function placeholderImage(brand, model) {
  const label = `${brand} ${model}`;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#15213d" />
        <stop offset="100%" stop-color="#09111d" />
      </linearGradient>
    </defs>
    <rect width="800" height="420" rx="26" fill="url(#g)" />
    <rect x="72" y="108" width="656" height="196" rx="26" fill="#0f1a30" stroke="#31425f" stroke-width="8" />
    <g fill="#1d2b45">
      ${Array.from({length: 14}).map((_, i) => `<rect x="${100 + i * 42}" y="132" width="32" height="26" rx="6" />`).join('')}
      ${Array.from({length: 13}).map((_, i) => `<rect x="112 + ${i * 44}" y="174" width="34" height="28" rx="6" />`).join('')}
      ${Array.from({length: 12}).map((_, i) => `<rect x="124 + ${i * 46}" y="218" width="36" height="28" rx="6" />`).join('')}
      <rect x="180" y="260" width="240" height="26" rx="8" />
      ${Array.from({length: 5}).map((_, i) => `<rect x="${444 + i * 48}" y="260" width="36" height="26" rx="6" />`).join('')}
    </g>
    <text x="72" y="64" fill="#89a3ff" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="700">${brand}</text>
    <text x="72" y="94" fill="#f3f6ff" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800">${model}</text>
    <text x="72" y="356" fill="#93a6c7" font-family="Inter, Arial, sans-serif" font-size="18">Drop in a real product image later by replacing image, topImage, and sideImage.</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const catalog = Object.entries(brandModels).flatMap(([brand, models], brandIndex) =>
  models.map((model, modelIndex) => {
    const index = brandIndex * 10 + modelIndex;
    const switchType = /he|rapid|hall|magnetic|analog/i.test(model)
      ? (brand === 'Razer' ? 'Analog Optical' : brand === 'SteelSeries' || brand === 'Corsair' || brand === 'Logitech' ? 'Magnetic' : 'Hall Effect')
      : techByBrand[brand];
    const wireless = /wireless|pro|max|lite|v2|v3|azoth|falchion|g915|m75|rk|air|halo|field/i.test(model) || wirelessBrands.has(brand);
    const size = sizeFor(model, index);
    const price = priceFor(brand, modelIndex) + (size === 'Full-size' ? 30 : 0) + (/HE|Pro|Max|Ultra/i.test(model) ? 20 : 0);
    const latency = switchType === 'Hall Effect' || switchType === 'Magnetic' || switchType === 'Analog Optical'
      ? (0.2 + (modelIndex % 6) * 0.15).toFixed(1)
      : (1.8 + (modelIndex % 7) * 0.4).toFixed(1);
    const polling = switchType === 'Hall Effect' || switchType === 'Magnetic' || switchType === 'Analog Optical'
      ? (modelIndex % 2 === 0 ? 8000 : 1000)
      : 1000;
    const image = placeholderImage(brand, model);
    return {
      id: slugify(`${brand}-${model}`),
      brand,
      model,
      size,
      layout: pick(layouts, index),
      connection: wireless ? ['2.4 GHz', 'Bluetooth', 'USB-C'] : ['USB-C'],
      wireless,
      switchType,
      hotSwap: !['Logitech', 'Razer', 'Corsair', 'SteelSeries', 'HyperX'].includes(brand) || /75|pro|q|v|max|m1|azoth/i.test(model),
      rapidTrigger: switchType !== 'Mechanical',
      mounting: pick(mounts, index),
      caseMaterial: pick(caseMaterials, index),
      plateMaterial: pick(plateMaterials, index),
      keycapMaterial: pick(keycaps, index),
      backlight: pick(backlights, index),
      pollingRate: polling,
      latencyMs: Number(latency),
      weightG: 690 + index * 9,
      dimensions: `${285 + (index % 8) * 14} x ${110 + (index % 6) * 7} x ${28 + (index % 4) * 3} mm`,
      software: pick(softwares, index),
      price,
      knob: /q1|v1|v6|q6|azoth|pro|max|m1|p1|field|rt100/i.test(model.toLowerCase()),
      display: /azoth|rt100|k1|v75/i.test(model.toLowerCase()),
      soundProfile: pick(soundProfiles, index),
      notes: `${brand} ${model} is included as a starter catalog entry. Replace any placeholder specs or images with verified product data over time.`,
      image,
      topImage: image,
      sideImage: image
    };
  })
);

export const brands = Object.keys(brandModels);
