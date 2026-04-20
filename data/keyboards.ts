import { keyboardImageDataUri, slugify } from "@/lib/utils";

export type Keyboard = {
  id: string;
  brand: string;
  model: string;
  size: string;
  switchType: string;
  connection: string[];
  wireless: boolean;
  hotSwap: boolean;
  price: number;
  layout: string;
  image: string;
  topImage: string;
  sideImage: string;
  tags: string[];
  notes: string;
  soundProfile: string;
  batteryHours: number | null;
  pollingRateHz: number;
  latencyMs: number;
  rapidTrigger: boolean;
  actuationRangeMm: string;
  mounting: string;
  caseMaterial: string;
  plateMaterial: string;
  keycapMaterial: string;
  backlight: string;
  software: string;
  weightG: number;
  dimensions: string;
  knob: boolean;
  display: boolean;
  profile: string;
};

type Seed = {
  model: string;
  size: string;
  switchType: string;
  wireless?: boolean;
  hotSwap?: boolean;
  price?: number;
  connection?: string[];
  layout?: string;
  tags?: string[];
  notes?: string;
  soundProfile?: string;
  batteryHours?: number | null;
  pollingRateHz?: number;
  latencyMs?: number;
  rapidTrigger?: boolean;
  actuationRangeMm?: string;
  mounting?: string;
  caseMaterial?: string;
  plateMaterial?: string;
  keycapMaterial?: string;
  backlight?: string;
  software?: string;
  weightG?: number;
  dimensions?: string;
  knob?: boolean;
  display?: boolean;
  profile?: string;
};

const brandSoftware: Record<string, string> = {
  Logitech: "G HUB",
  Razer: "Synapse",
  Corsair: "iCUE",
  SteelSeries: "GG",
  ASUS: "Armoury Crate",
  Keychron: "Launcher / VIA",
  Wooting: "Wootility",
  Akko: "Akko Cloud Driver",
  NuPhy: "NuPhyIO",
  Glorious: "Glorious Core",
  Ducky: "On-board",
  Epomaker: "Epomaker Driver",
  HyperX: "NGENUITY",
  "Royal Kludge": "RK Software",
  "Cooler Master": "MasterPlus",
  MonsGeek: "VIA",
  Lemokey: "Launcher / VIA",
  DrunkDeer: "DrunkDeer Driver",
  Gamakay: "Gamakay Driver",
  GravaStar: "GravaStar",
};

function inferPolling(seed: Seed) {
  if (seed.pollingRateHz) return seed.pollingRateHz;
  if (/hall|magnetic|analog/i.test(seed.switchType)) return 8000;
  if (/wireless/i.test(seed.switchType) || seed.wireless) return 1000;
  return 1000;
}

function inferLatency(seed: Seed) {
  if (seed.latencyMs) return seed.latencyMs;
  if (/hall|magnetic|analog/i.test(seed.switchType)) return seed.wireless ? 1.0 : 0.4;
  if (/membrane/i.test(seed.switchType)) return 4.8;
  if (/low-profile/i.test(seed.switchType)) return seed.wireless ? 2.0 : 1.4;
  return seed.wireless ? 2.6 : 1.8;
}

function inferBattery(seed: Seed) {
  if (seed.batteryHours !== undefined) return seed.batteryHours;
  if (!seed.wireless) return null;
  if (/hall|magnetic|analog/i.test(seed.switchType)) return 45;
  if (/low-profile/i.test(seed.switchType)) return 90;
  return 80;
}

function inferSound(seed: Seed) {
  if (seed.soundProfile) return seed.soundProfile;
  if (/membrane/i.test(seed.switchType)) return "Soft";
  if (/hall|magnetic|analog/i.test(seed.switchType)) return "Focused";
  if (/low-profile/i.test(seed.switchType)) return "Thin";
  if (seed.price && seed.price >= 180) return "Refined";
  return "Balanced";
}

function inferMounting(seed: Seed) {
  if (seed.mounting) return seed.mounting;
  if (/hall|magnetic|analog/i.test(seed.switchType) && !seed.wireless) return "Tray";
  if (seed.hotSwap && (seed.price ?? 0) >= 140) return "Gasket";
  return "Tray";
}

function inferCase(seed: Seed) {
  if (seed.caseMaterial) return seed.caseMaterial;
  if ((seed.price ?? 0) >= 180) return "Aluminum";
  if ((seed.price ?? 0) >= 120) return "Aluminum + Plastic";
  return "Plastic";
}

function inferPlate(seed: Seed) {
  if (seed.plateMaterial) return seed.plateMaterial;
  if (/hall|magnetic|analog/i.test(seed.switchType)) return "Aluminum";
  if (seed.hotSwap && (seed.price ?? 0) >= 140) return "PC";
  return "Steel";
}

function inferKeycaps(seed: Seed) {
  if (seed.keycapMaterial) return seed.keycapMaterial;
  if ((seed.price ?? 0) >= 110) return "PBT";
  return "ABS";
}

function inferBacklight(seed: Seed) {
  if (seed.backlight) return seed.backlight;
  return /membrane/i.test(seed.switchType) ? "Zone RGB" : "Per-key RGB";
}

function inferWeight(seed: Seed) {
  if (seed.weightG) return seed.weightG;
  const baseBySize: Record<string, number> = {
    "60%": 640,
    "65%": 760,
    "70%": 820,
    "75%": 980,
    "80%": 930,
    TKL: 960,
    "95%": 1080,
    "96%": 1120,
    "1800": 1180,
    "Full-size": 1240,
  };
  const base = baseBySize[seed.size] ?? 980;
  const caseBump = seed.hotSwap ? 110 : 0;
  const wirelessBump = seed.wireless ? 70 : 0;
  const premiumBump = (seed.price ?? 0) >= 200 ? 130 : 0;
  return base + caseBump + wirelessBump + premiumBump;
}

function inferDimensions(seed: Seed) {
  if (seed.dimensions) return seed.dimensions;
  const map: Record<string, string> = {
    "60%": "295 × 105 × 38 mm",
    "65%": "320 × 115 × 38 mm",
    "70%": "330 × 120 × 38 mm",
    "75%": "330 × 145 × 40 mm",
    "80%": "346 × 142 × 37 mm",
    TKL: "360 × 140 × 38 mm",
    "95%": "380 × 140 × 40 mm",
    "96%": "390 × 145 × 41 mm",
    "1800": "395 × 144 × 42 mm",
    "Full-size": "440 × 140 × 40 mm",
  };
  return map[seed.size] ?? "330 × 140 × 40 mm";
}

function inferRapidTrigger(seed: Seed) {
  if (seed.rapidTrigger !== undefined) return seed.rapidTrigger;
  return /hall|magnetic|analog/i.test(seed.switchType);
}

function inferActuation(seed: Seed) {
  if (seed.actuationRangeMm) return seed.actuationRangeMm;
  if (/hall|magnetic|analog/i.test(seed.switchType)) return "0.1–4.0 mm";
  if (/optical/i.test(seed.switchType)) return "1.2–3.6 mm";
  if (/low-profile/i.test(seed.switchType)) return "1.2–3.2 mm";
  return "2.0 mm fixed";
}

function inferProfile(seed: Seed) {
  if (seed.profile) return seed.profile;
  if (/low-profile/i.test(seed.switchType)) return "Low-profile";
  return "Standard";
}

function makeKeyboard(brand: string, seed: Seed): Keyboard {
  const connection = seed.connection ?? (seed.wireless ? ["2.4 GHz", "Bluetooth", "USB-C"] : ["USB-C"]);
  return {
    id: slugify(`${brand}-${seed.model}`),
    brand,
    model: seed.model,
    size: seed.size,
    switchType: seed.switchType,
    connection,
    wireless: Boolean(seed.wireless),
    hotSwap: Boolean(seed.hotSwap),
    price: seed.price ?? 129,
    layout: seed.layout ?? "ANSI",
    image: keyboardImageDataUri(brand, seed.model, seed.size, "hero"),
    topImage: keyboardImageDataUri(brand, seed.model, seed.size, "top"),
    sideImage: keyboardImageDataUri(brand, seed.model, seed.size, "side"),
    tags: seed.tags ?? [],
    notes: seed.notes ?? `${brand} ${seed.model} ${seed.size} keyboard in the catalog.`,
    soundProfile: inferSound(seed),
    batteryHours: inferBattery(seed),
    pollingRateHz: inferPolling(seed),
    latencyMs: inferLatency(seed),
    rapidTrigger: inferRapidTrigger(seed),
    actuationRangeMm: inferActuation(seed),
    mounting: inferMounting(seed),
    caseMaterial: inferCase(seed),
    plateMaterial: inferPlate(seed),
    keycapMaterial: inferKeycaps(seed),
    backlight: inferBacklight(seed),
    software: seed.software ?? brandSoftware[brand] ?? "Companion app",
    weightG: inferWeight(seed),
    dimensions: inferDimensions(seed),
    knob: Boolean(seed.knob),
    display: Boolean(seed.display),
    profile: inferProfile(seed),
  };
}

function addBrand(brand: string, models: Seed[]) {
  return models.map((seed) => makeKeyboard(brand, seed));
}

export const keyboards: Keyboard[] = [
  ...addBrand("Logitech", [
    { model: "G Pro X TKL", size: "TKL", switchType: "Mechanical", wireless: true, price: 199, tags: ["esports", "wireless"], soundProfile: "Firm" },
    { model: "G Pro X TKL Rapid", size: "TKL", switchType: "Magnetic", price: 179, tags: ["rapid trigger", "gaming"], latencyMs: 0.7 },
    { model: "G915 X Lightspeed", size: "Full-size", switchType: "Low-profile mechanical", wireless: true, price: 229, batteryHours: 80 },
    { model: "G915 X TKL", size: "TKL", switchType: "Low-profile mechanical", wireless: true, price: 199, batteryHours: 90 },
    { model: "G715", size: "TKL", switchType: "Mechanical", wireless: true, price: 179, batteryHours: 25 },
    { model: "G713", size: "TKL", switchType: "Mechanical", price: 149 },
    { model: "G512", size: "Full-size", switchType: "Mechanical", price: 109 },
    { model: "G413 SE", size: "Full-size", switchType: "Mechanical", price: 79, backlight: "Single color" },
  ]),
  ...addBrand("Razer", [
    { model: "Huntsman V3 Pro Mini", size: "60%", switchType: "Analog optical", price: 179, tags: ["rapid trigger"], rapidTrigger: true, pollingRateHz: 8000 },
    { model: "Huntsman V3 Pro TKL", size: "TKL", switchType: "Analog optical", price: 219, tags: ["rapid trigger"], rapidTrigger: true, pollingRateHz: 8000, knob: true },
    { model: "Huntsman V3 Pro", size: "Full-size", switchType: "Analog optical", price: 249, rapidTrigger: true, pollingRateHz: 8000 },
    { model: "BlackWidow V4 75%", size: "75%", switchType: "Mechanical", hotSwap: true, price: 189, mounting: "Gasket", soundProfile: "Pop" },
    { model: "BlackWidow V4 Pro 75%", size: "75%", switchType: "Mechanical", hotSwap: true, price: 299, mounting: "Gasket", display: true, knob: true },
    { model: "BlackWidow V4 Pro", size: "Full-size", switchType: "Mechanical", price: 229, knob: true },
    { model: "BlackWidow V4 X", size: "Full-size", switchType: "Mechanical", price: 169 },
    { model: "DeathStalker V2 Pro", size: "Full-size", switchType: "Low-profile optical", wireless: true, price: 249, batteryHours: 40 },
    { model: "DeathStalker V2 Pro TKL", size: "TKL", switchType: "Low-profile optical", wireless: true, price: 219, batteryHours: 50 },
    { model: "DeathStalker V2", size: "Full-size", switchType: "Low-profile optical", price: 199 },
    { model: "Ornata V3", size: "Full-size", switchType: "Mecha-membrane", price: 69, soundProfile: "Soft" },
  ]),
  ...addBrand("Corsair", [
    { model: "K70 MAX", size: "Full-size", switchType: "Magnetic", price: 229, pollingRateHz: 8000, rapidTrigger: true },
    { model: "K70 RGB Pro", size: "Full-size", switchType: "Mechanical", price: 169, pollingRateHz: 8000 },
    { model: "K70 Core", size: "Full-size", switchType: "Mechanical", price: 99 },
    { model: "K70 Pro Mini Wireless", size: "60%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 179, batteryHours: 32 },
    { model: "K65 Plus Wireless", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 159, batteryHours: 120, mounting: "Gasket" },
    { model: "K65 RGB Mini", size: "60%", switchType: "Mechanical", price: 109 },
    { model: "K100 RGB", size: "Full-size", switchType: "Mechanical", price: 249, pollingRateHz: 4000, knob: true },
    { model: "K55 RGB Pro", size: "Full-size", switchType: "Membrane", price: 59, soundProfile: "Soft" },
  ]),
  ...addBrand("SteelSeries", [
    { model: "Apex Pro Mini Wireless", size: "60%", switchType: "Magnetic", wireless: true, price: 229, batteryHours: 30, rapidTrigger: true },
    { model: "Apex Pro Mini", size: "60%", switchType: "Magnetic", price: 179, rapidTrigger: true },
    { model: "Apex Pro TKL Wireless (2023)", size: "TKL", switchType: "Magnetic", wireless: true, price: 249, batteryHours: 37, display: true, rapidTrigger: true },
    { model: "Apex Pro TKL (2023)", size: "TKL", switchType: "Magnetic", price: 189, rapidTrigger: true },
    { model: "Apex Pro", size: "Full-size", switchType: "Magnetic", price: 209, rapidTrigger: true, display: true },
    { model: "Apex 9 TKL", size: "TKL", switchType: "Optical", price: 139, latencyMs: 1.0 },
    { model: "Apex 7", size: "Full-size", switchType: "Mechanical", price: 149, display: true },
  ]),
  ...addBrand("ASUS", [
    { model: "ROG Azoth Extreme", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 499, mounting: "Gasket", display: true, knob: true, caseMaterial: "Aluminum", plateMaterial: "Carbon Fiber", soundProfile: "Deep" },
    { model: "ROG Azoth", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 249, mounting: "Gasket", display: true, knob: true },
    { model: "ROG Falchion RX Low Profile", size: "65%", switchType: "Low-profile optical", wireless: true, price: 169, batteryHours: 98 },
    { model: "ROG Falchion Ace HFX", size: "65%", switchType: "Magnetic", price: 199, rapidTrigger: true, pollingRateHz: 8000 },
    { model: "ROG Strix Scope II 96 Wireless", size: "96%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 179, batteryHours: 150 },
    { model: "ROG Strix Scope II 96", size: "96%", switchType: "Mechanical", price: 149 },
    { model: "ROG Strix Scope RX TKL Wireless Deluxe", size: "TKL", switchType: "Optical", wireless: true, price: 189, batteryHours: 70 },
    { model: "TUF Gaming K3 Gen II", size: "Full-size", switchType: "Mechanical", price: 99 },
  ]),
  ...addBrand("Keychron", [
    { model: "Q1 Max", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 209, mounting: "Gasket", knob: true, soundProfile: "Thocky", caseMaterial: "Aluminum", plateMaterial: "PC" },
    { model: "Q2 Max", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 199, mounting: "Gasket", soundProfile: "Thocky", caseMaterial: "Aluminum", plateMaterial: "PC" },
    { model: "Q3 Max", size: "TKL", switchType: "Mechanical", wireless: true, hotSwap: true, price: 209, mounting: "Gasket", soundProfile: "Full", caseMaterial: "Aluminum", plateMaterial: "PC" },
    { model: "Q5 Max", size: "96%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 219, mounting: "Gasket", soundProfile: "Full", caseMaterial: "Aluminum", plateMaterial: "PC" },
    { model: "Q6 Max", size: "Full-size", switchType: "Mechanical", wireless: true, hotSwap: true, price: 229, mounting: "Gasket", soundProfile: "Dense", caseMaterial: "Aluminum", plateMaterial: "PC" },
    { model: "Q1 HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 239, rapidTrigger: true, mounting: "Gasket", caseMaterial: "Aluminum", plateMaterial: "PC" },
    { model: "K2 HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 139, rapidTrigger: true },
    { model: "K2 Max", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 109, batteryHours: 100 },
    { model: "K8 Max", size: "TKL", switchType: "Mechanical", wireless: true, hotSwap: true, price: 119, batteryHours: 100 },
    { model: "V1 Max", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 104, mounting: "Gasket" },
    { model: "V6 Max", size: "Full-size", switchType: "Mechanical", wireless: true, hotSwap: true, price: 114, mounting: "Gasket" },
    { model: "C3 Pro", size: "TKL", switchType: "Mechanical", hotSwap: true, price: 44, backlight: "Red or RGB" },
  ]),
  ...addBrand("Wooting", [
    { model: "80HE", size: "80%", switchType: "Hall Effect", hotSwap: true, price: 199, rapidTrigger: true, pollingRateHz: 8000, latencyMs: 0.3, mounting: "Gasket", soundProfile: "Clacky", software: "Wootility" },
    { model: "60HE+", size: "60%", switchType: "Hall Effect", hotSwap: true, price: 174, rapidTrigger: true, pollingRateHz: 8000, latencyMs: 0.3 },
    { model: "60HE+ Module", size: "60%", switchType: "Hall Effect", hotSwap: true, price: 139, rapidTrigger: true, pollingRateHz: 8000, latencyMs: 0.3 },
    { model: "Two HE", size: "Full-size", switchType: "Hall Effect", hotSwap: true, price: 194, rapidTrigger: true, pollingRateHz: 1000, latencyMs: 1.2 },
  ]),
  ...addBrand("Akko", [
    { model: "MOD 007B HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 189, rapidTrigger: true, mounting: "Gasket", caseMaterial: "Aluminum" },
    { model: "5075B Plus", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 89, soundProfile: "Pop" },
    { model: "5075S VIA", size: "75%", switchType: "Mechanical", hotSwap: true, price: 99, soundProfile: "Balanced" },
    { model: "MonsGeek FUN60 Max", size: "60%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 129, rapidTrigger: true },
    { model: "MU01", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 139, caseMaterial: "Wood + Aluminum", soundProfile: "Warm" },
    { model: "SPR67", size: "65%", switchType: "Mechanical", hotSwap: true, price: 119, mounting: "Gasket" },
  ]),
  ...addBrand("NuPhy", [
    { model: "Air60 V2", size: "60%", switchType: "Low-profile mechanical", wireless: true, hotSwap: true, price: 119, batteryHours: 90, profile: "Low-profile" },
    { model: "Air75 V2", size: "75%", switchType: "Low-profile mechanical", wireless: true, hotSwap: true, price: 129, batteryHours: 90, profile: "Low-profile" },
    { model: "Air96 V2", size: "96%", switchType: "Low-profile mechanical", wireless: true, hotSwap: true, price: 139, batteryHours: 90, profile: "Low-profile" },
    { model: "Halo65", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 119, soundProfile: "Poppy" },
    { model: "Halo75 V2", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 149, soundProfile: "Poppy" },
    { model: "Gem80", size: "TKL", switchType: "Mechanical", hotSwap: true, price: 179, mounting: "Gasket", caseMaterial: "Aluminum" },
    { model: "Field75 HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 159, rapidTrigger: true, knob: true },
  ]),
  ...addBrand("Glorious", [
    { model: "GMMK 3 Pro HE", size: "75%", switchType: "Hall Effect", hotSwap: true, price: 299, rapidTrigger: true, mounting: "Gasket", caseMaterial: "Aluminum" },
    { model: "GMMK 3 Pro", size: "75%", switchType: "Mechanical", hotSwap: true, price: 249, mounting: "Gasket", caseMaterial: "Aluminum" },
    { model: "GMMK 3 HE", size: "65%", switchType: "Hall Effect", hotSwap: true, price: 199, rapidTrigger: true },
    { model: "GMMK 3", size: "65%", switchType: "Mechanical", hotSwap: true, price: 149 },
    { model: "GMMK 2 96%", size: "96%", switchType: "Mechanical", hotSwap: true, price: 119 },
    { model: "GMMK 2 Compact", size: "65%", switchType: "Mechanical", hotSwap: true, price: 99 },
  ]),
  ...addBrand("Ducky", [
    { model: "One 3 Mini", size: "60%", switchType: "Mechanical", hotSwap: true, price: 119, software: "On-board" },
    { model: "One 3 SF", size: "65%", switchType: "Mechanical", hotSwap: true, price: 129, software: "On-board" },
    { model: "One 3 TKL", size: "TKL", switchType: "Mechanical", hotSwap: true, price: 139, software: "On-board" },
    { model: "One 3 Classic", size: "Full-size", switchType: "Mechanical", hotSwap: true, price: 149, software: "On-board" },
    { model: "ProjectD Tinker 75", size: "75%", switchType: "Mechanical", hotSwap: true, price: 139, software: "On-board" },
    { model: "Origin Black Ducky x Varmilo Miya Pro", size: "65%", switchType: "Mechanical", price: 129, software: "On-board", soundProfile: "Classic" },
  ]),
  ...addBrand("Epomaker", [
    { model: "Aula F75", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 79, soundProfile: "Creamy" },
    { model: "TH80 Pro V2", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 89, soundProfile: "Creamy" },
    { model: "EK68", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 69 },
    { model: "RT100", size: "95%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 115, display: true, knob: true },
    { model: "P75", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 99 },
    { model: "x Aula F99", size: "96%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 99 },
    { model: "Shadow-X", size: "70%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 109 },
  ]),
  ...addBrand("HyperX", [
    { model: "Alloy Origins 60", size: "60%", switchType: "Mechanical", price: 79 },
    { model: "Alloy Origins Core", size: "TKL", switchType: "Mechanical", price: 89 },
    { model: "Alloy Origins", size: "Full-size", switchType: "Mechanical", price: 109 },
    { model: "Alloy Rise", size: "Full-size", switchType: "Mechanical", hotSwap: true, price: 169, software: "NGENUITY", mounting: "Gasket" },
    { model: "Alloy Rise 75", size: "75%", switchType: "Mechanical", hotSwap: true, price: 149, software: "NGENUITY", mounting: "Gasket" },
    { model: "Alloy Core RGB", size: "Full-size", switchType: "Membrane", price: 49, soundProfile: "Soft" },
  ]),
  ...addBrand("Royal Kludge", [
    { model: "RK61", size: "60%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 59 },
    { model: "RK68", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 64 },
    { model: "RK84", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 79 },
    { model: "RK87", size: "TKL", switchType: "Mechanical", wireless: true, hotSwap: true, price: 79 },
    { model: "RK96", size: "96%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 89 },
    { model: "S98", size: "96%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 99, display: true, knob: true },
    { model: "M75", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 109, knob: true },
  ]),
  ...addBrand("Cooler Master", [
    { model: "CK720", size: "65%", switchType: "Mechanical", hotSwap: true, price: 99 },
    { model: "CK721", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 119, batteryHours: 72 },
    { model: "CK352", size: "TKL", switchType: "Mechanical", price: 69 },
    { model: "SK620", size: "60%", switchType: "Low-profile mechanical", price: 79, profile: "Low-profile" },
    { model: "MK770", size: "96%", switchType: "Mechanical", wireless: true, price: 119, batteryHours: 72 },
  ]),
  ...addBrand("MonsGeek", [
    { model: "M1W V3", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 129, mounting: "Gasket", caseMaterial: "Aluminum", soundProfile: "Deep" },
    { model: "M1 V5", size: "75%", switchType: "Mechanical", hotSwap: true, price: 109, mounting: "Gasket", caseMaterial: "Aluminum" },
    { model: "M7W", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 119, mounting: "Gasket", caseMaterial: "Aluminum" },
    { model: "M5W", size: "1800", switchType: "Mechanical", wireless: true, hotSwap: true, price: 149, mounting: "Gasket", caseMaterial: "Aluminum" },
    { model: "FUN60 Pro", size: "60%", switchType: "Hall Effect", hotSwap: true, price: 99, rapidTrigger: true },
  ]),
  ...addBrand("Lemokey", [
    { model: "P1 Pro", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 129, mounting: "Gasket", knob: true },
    { model: "P1 HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 169, rapidTrigger: true, mounting: "Gasket", knob: true },
    { model: "L1", size: "Full-size", switchType: "Mechanical", wireless: true, hotSwap: true, price: 209, mounting: "Gasket", caseMaterial: "Aluminum" },
    { model: "L3", size: "TKL", switchType: "Mechanical", wireless: true, hotSwap: true, price: 199, mounting: "Gasket", caseMaterial: "Aluminum" },
    { model: "X1", size: "TKL", switchType: "Low-profile mechanical", wireless: true, hotSwap: true, price: 119, profile: "Low-profile" },
  ]),
  ...addBrand("DrunkDeer", [
    { model: "G60", size: "60%", switchType: "Hall Effect", price: 129, rapidTrigger: true, pollingRateHz: 8000 },
    { model: "A75 Pro", size: "75%", switchType: "Hall Effect", price: 139, rapidTrigger: true, pollingRateHz: 8000 },
    { model: "A75 Ultra", size: "75%", switchType: "Hall Effect", price: 159, rapidTrigger: true, pollingRateHz: 8000 },
    { model: "A75 Master", size: "75%", switchType: "Hall Effect", price: 179, rapidTrigger: true, pollingRateHz: 8000 },
    { model: "G65", size: "65%", switchType: "Hall Effect", price: 119, rapidTrigger: true, pollingRateHz: 8000 },
  ]),
  ...addBrand("Gamakay", [
    { model: "TK68", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 69 },
    { model: "TK75", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 89 },
    { model: "TK75 HE", size: "75%", switchType: "Hall Effect", price: 129, rapidTrigger: true },
    { model: "LK67", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 59, mounting: "Gasket" },
    { model: "SN75", size: "75%", switchType: "Mechanical", hotSwap: true, price: 99, mounting: "Gasket" },
    { model: "K61 Pro", size: "60%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 49 },
  ]),
  ...addBrand("GravaStar", [
    { model: "Mercury K1", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 149, soundProfile: "Metallic", caseMaterial: "Aluminum" },
    { model: "Mercury K1 Pro", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 169, soundProfile: "Metallic", caseMaterial: "Aluminum", display: true },
    { model: "Mercury K1 Lite", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 119 },
    { model: "Mercury V75", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 149, caseMaterial: "Aluminum" },
    { model: "Mercury V75 Pro", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 179, caseMaterial: "Aluminum", knob: true },
    { model: "Mercury V75 HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 199, caseMaterial: "Aluminum", rapidTrigger: true },
  ]),
].sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));

export const brands = Array.from(new Set(keyboards.map((item) => item.brand)));
export const sizes = Array.from(new Set(keyboards.map((item) => item.size)));
