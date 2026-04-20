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
};

function makeKeyboard(brand: string, seed: Seed): Keyboard {
  const connection = seed.connection ?? (seed.wireless ? ["2.4 GHz", "Bluetooth", "USB-C"] : ["USB-C"]);
  const image = keyboardImageDataUri(brand, seed.model, seed.size);
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
    image,
    topImage: image,
    sideImage: image,
    tags: seed.tags ?? [],
    notes: seed.notes ?? `${brand} ${seed.model} ${seed.size} keyboard in the catalog.`,
  };
}

function addBrand(brand: string, models: Seed[]) {
  return models.map((seed) => makeKeyboard(brand, seed));
}

export const keyboards: Keyboard[] = [
  ...addBrand("Logitech", [
    { model: "G Pro X TKL", size: "TKL", switchType: "Mechanical", wireless: true, price: 199, tags: ["esports", "wireless"] },
    { model: "G Pro X TKL Rapid", size: "TKL", switchType: "Magnetic", price: 179, tags: ["rapid trigger", "gaming"] },
    { model: "G915 X Lightspeed", size: "Full-size", switchType: "Low-profile mechanical", wireless: true, price: 229 },
    { model: "G915 X TKL", size: "TKL", switchType: "Low-profile mechanical", wireless: true, price: 199 },
    { model: "G715", size: "TKL", switchType: "Mechanical", wireless: true, price: 179 },
    { model: "G713", size: "TKL", switchType: "Mechanical", price: 149 },
    { model: "G512", size: "Full-size", switchType: "Mechanical", price: 109 },
    { model: "G413 SE", size: "Full-size", switchType: "Mechanical", price: 79 },
  ]),
  ...addBrand("Razer", [
    { model: "Huntsman V3 Pro Mini", size: "60%", switchType: "Analog optical", price: 179, tags: ["rapid trigger"] },
    { model: "Huntsman V3 Pro TKL", size: "TKL", switchType: "Analog optical", price: 219, tags: ["rapid trigger"] },
    { model: "Huntsman V3 Pro", size: "Full-size", switchType: "Analog optical", price: 249 },
    { model: "BlackWidow V4 75%", size: "75%", switchType: "Mechanical", hotSwap: true, price: 189 },
    { model: "BlackWidow V4 Pro 75%", size: "75%", switchType: "Mechanical", hotSwap: true, price: 299 },
    { model: "BlackWidow V4 Pro", size: "Full-size", switchType: "Mechanical", price: 229 },
    { model: "BlackWidow V4 X", size: "Full-size", switchType: "Mechanical", price: 169 },
    { model: "DeathStalker V2 Pro", size: "Full-size", switchType: "Low-profile optical", wireless: true, price: 249 },
    { model: "DeathStalker V2 Pro TKL", size: "TKL", switchType: "Low-profile optical", wireless: true, price: 219 },
    { model: "DeathStalker V2", size: "Full-size", switchType: "Low-profile optical", price: 199 },
    { model: "Ornata V3", size: "Full-size", switchType: "Mecha-membrane", price: 69 },
  ]),
  ...addBrand("Corsair", [
    { model: "K70 MAX", size: "Full-size", switchType: "Magnetic", price: 229 },
    { model: "K70 RGB Pro", size: "Full-size", switchType: "Mechanical", price: 169 },
    { model: "K70 Core", size: "Full-size", switchType: "Mechanical", price: 99 },
    { model: "K70 Pro Mini Wireless", size: "60%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 179 },
    { model: "K65 Plus Wireless", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 159 },
    { model: "K65 RGB Mini", size: "60%", switchType: "Mechanical", price: 109 },
    { model: "K100 RGB", size: "Full-size", switchType: "Mechanical", price: 249 },
    { model: "K55 RGB Pro", size: "Full-size", switchType: "Membrane", price: 59 },
  ]),
  ...addBrand("SteelSeries", [
    { model: "Apex Pro Mini Wireless", size: "60%", switchType: "Magnetic", wireless: true, price: 229 },
    { model: "Apex Pro Mini", size: "60%", switchType: "Magnetic", price: 179 },
    { model: "Apex Pro TKL Wireless (2023)", size: "TKL", switchType: "Magnetic", wireless: true, price: 249 },
    { model: "Apex Pro TKL (2023)", size: "TKL", switchType: "Magnetic", price: 189 },
    { model: "Apex Pro", size: "Full-size", switchType: "Magnetic", price: 209 },
    { model: "Apex 9 TKL", size: "TKL", switchType: "Optical", price: 139 },
    { model: "Apex 7", size: "Full-size", switchType: "Mechanical", price: 149 },
  ]),
  ...addBrand("ASUS", [
    { model: "ROG Azoth Extreme", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 499 },
    { model: "ROG Azoth", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 249 },
    { model: "ROG Falchion RX Low Profile", size: "65%", switchType: "Low-profile optical", wireless: true, price: 169 },
    { model: "ROG Falchion Ace HFX", size: "65%", switchType: "Magnetic", price: 199 },
    { model: "ROG Strix Scope II 96 Wireless", size: "96%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 179 },
    { model: "ROG Strix Scope II 96", size: "96%", switchType: "Mechanical", price: 149 },
    { model: "ROG Strix Scope RX TKL Wireless Deluxe", size: "TKL", switchType: "Optical", wireless: true, price: 189 },
    { model: "TUF Gaming K3 Gen II", size: "Full-size", switchType: "Mechanical", price: 99 },
  ]),
  ...addBrand("Keychron", [
    { model: "Q1 Max", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 209 },
    { model: "Q2 Max", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 199 },
    { model: "Q3 Max", size: "TKL", switchType: "Mechanical", wireless: true, hotSwap: true, price: 209 },
    { model: "Q5 Max", size: "96%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 219 },
    { model: "Q6 Max", size: "Full-size", switchType: "Mechanical", wireless: true, hotSwap: true, price: 229 },
    { model: "Q1 HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 239 },
    { model: "K2 HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 139 },
    { model: "K2 Max", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 109 },
    { model: "K8 Max", size: "TKL", switchType: "Mechanical", wireless: true, hotSwap: true, price: 119 },
    { model: "V1 Max", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 104 },
    { model: "V6 Max", size: "Full-size", switchType: "Mechanical", wireless: true, hotSwap: true, price: 114 },
    { model: "C3 Pro", size: "TKL", switchType: "Mechanical", hotSwap: true, price: 44 },
  ]),
  ...addBrand("Wooting", [
    { model: "80HE", size: "80%", switchType: "Hall Effect", hotSwap: true, price: 199 },
    { model: "60HE+", size: "60%", switchType: "Hall Effect", hotSwap: true, price: 174 },
    { model: "60HE+ Module", size: "60%", switchType: "Hall Effect", hotSwap: true, price: 139 },
    { model: "Two HE", size: "Full-size", switchType: "Hall Effect", hotSwap: true, price: 194 },
  ]),
  ...addBrand("Akko", [
    { model: "MOD 007B HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 189 },
    { model: "5075B Plus", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 89 },
    { model: "5075S VIA", size: "75%", switchType: "Mechanical", hotSwap: true, price: 99 },
    { model: "MonsGeek FUN60 Max", size: "60%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 129 },
    { model: "MU01", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 139 },
    { model: "SPR67", size: "65%", switchType: "Mechanical", hotSwap: true, price: 119 },
  ]),
  ...addBrand("NuPhy", [
    { model: "Air60 V2", size: "60%", switchType: "Low-profile mechanical", wireless: true, hotSwap: true, price: 119 },
    { model: "Air75 V2", size: "75%", switchType: "Low-profile mechanical", wireless: true, hotSwap: true, price: 129 },
    { model: "Air96 V2", size: "96%", switchType: "Low-profile mechanical", wireless: true, hotSwap: true, price: 139 },
    { model: "Halo65", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 119 },
    { model: "Halo75 V2", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 149 },
    { model: "Gem80", size: "TKL", switchType: "Mechanical", hotSwap: true, price: 179 },
    { model: "Field75 HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 159 },
  ]),
  ...addBrand("Glorious", [
    { model: "GMMK 3 Pro HE", size: "75%", switchType: "Hall Effect", hotSwap: true, price: 299 },
    { model: "GMMK 3 Pro", size: "75%", switchType: "Mechanical", hotSwap: true, price: 249 },
    { model: "GMMK 3 HE", size: "65%", switchType: "Hall Effect", hotSwap: true, price: 199 },
    { model: "GMMK 3", size: "65%", switchType: "Mechanical", hotSwap: true, price: 149 },
    { model: "GMMK 2 96%", size: "96%", switchType: "Mechanical", hotSwap: true, price: 119 },
    { model: "GMMK 2 Compact", size: "65%", switchType: "Mechanical", hotSwap: true, price: 99 },
  ]),
  ...addBrand("Ducky", [
    { model: "One 3 Mini", size: "60%", switchType: "Mechanical", hotSwap: true, price: 119 },
    { model: "One 3 SF", size: "65%", switchType: "Mechanical", hotSwap: true, price: 129 },
    { model: "One 3 TKL", size: "TKL", switchType: "Mechanical", hotSwap: true, price: 139 },
    { model: "One 3 Classic", size: "Full-size", switchType: "Mechanical", hotSwap: true, price: 149 },
    { model: "ProjectD Tinker 75", size: "75%", switchType: "Mechanical", hotSwap: true, price: 139 },
    { model: "Origin Black Ducky x Varmilo Miya Pro", size: "65%", switchType: "Mechanical", price: 129 },
  ]),
  ...addBrand("Epomaker", [
    { model: "Aula F75", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 79 },
    { model: "TH80 Pro V2", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 89 },
    { model: "EK68", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 69 },
    { model: "RT100", size: "95%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 115 },
    { model: "P75", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 99 },
    { model: "x Aula F99", size: "96%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 99 },
    { model: "Shadow-X", size: "70%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 109 },
  ]),
  ...addBrand("HyperX", [
    { model: "Alloy Origins 60", size: "60%", switchType: "Mechanical", price: 79 },
    { model: "Alloy Origins Core", size: "TKL", switchType: "Mechanical", price: 89 },
    { model: "Alloy Origins", size: "Full-size", switchType: "Mechanical", price: 109 },
    { model: "Alloy Rise", size: "Full-size", switchType: "Mechanical", hotSwap: true, price: 169 },
    { model: "Alloy Rise 75", size: "75%", switchType: "Mechanical", hotSwap: true, price: 149 },
    { model: "Alloy Core RGB", size: "Full-size", switchType: "Membrane", price: 49 },
  ]),
  ...addBrand("Royal Kludge", [
    { model: "RK61", size: "60%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 59 },
    { model: "RK68", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 64 },
    { model: "RK84", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 79 },
    { model: "RK87", size: "TKL", switchType: "Mechanical", wireless: true, hotSwap: true, price: 79 },
    { model: "RK96", size: "96%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 89 },
    { model: "S98", size: "96%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 99 },
    { model: "M75", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 109 },
  ]),
  ...addBrand("Cooler Master", [
    { model: "CK720", size: "65%", switchType: "Mechanical", hotSwap: true, price: 99 },
    { model: "CK721", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 119 },
    { model: "CK352", size: "TKL", switchType: "Mechanical", price: 69 },
    { model: "SK620", size: "60%", switchType: "Low-profile mechanical", price: 79 },
    { model: "MK770", size: "96%", switchType: "Mechanical", wireless: true, price: 119 },
  ]),
  ...addBrand("MonsGeek", [
    { model: "M1W V3", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 129 },
    { model: "M1 V5", size: "75%", switchType: "Mechanical", hotSwap: true, price: 109 },
    { model: "M7W", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 119 },
    { model: "M5W", size: "1800", switchType: "Mechanical", wireless: true, hotSwap: true, price: 149 },
    { model: "FUN60 Pro", size: "60%", switchType: "Hall Effect", hotSwap: true, price: 99 },
  ]),
  ...addBrand("Lemokey", [
    { model: "P1 Pro", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 129 },
    { model: "P1 HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 169 },
    { model: "L1", size: "Full-size", switchType: "Mechanical", wireless: true, hotSwap: true, price: 209 },
    { model: "L3", size: "TKL", switchType: "Mechanical", wireless: true, hotSwap: true, price: 199 },
    { model: "X1", size: "TKL", switchType: "Low-profile mechanical", wireless: true, hotSwap: true, price: 119 },
  ]),
  ...addBrand("DrunkDeer", [
    { model: "G60", size: "60%", switchType: "Hall Effect", price: 129 },
    { model: "A75 Pro", size: "75%", switchType: "Hall Effect", price: 139 },
    { model: "A75 Ultra", size: "75%", switchType: "Hall Effect", price: 159 },
    { model: "A75 Master", size: "75%", switchType: "Hall Effect", price: 179 },
    { model: "G65", size: "65%", switchType: "Hall Effect", price: 119 },
  ]),
  ...addBrand("Gamakay", [
    { model: "TK68", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 69 },
    { model: "TK75", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 89 },
    { model: "TK75 HE", size: "75%", switchType: "Hall Effect", price: 129 },
    { model: "LK67", size: "65%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 59 },
    { model: "SN75", size: "75%", switchType: "Mechanical", hotSwap: true, price: 99 },
    { model: "K61 Pro", size: "60%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 49 },
  ]),
  ...addBrand("GravaStar", [
    { model: "Mercury K1", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 149 },
    { model: "Mercury K1 Pro", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 169 },
    { model: "Mercury K1 Lite", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 119 },
    { model: "Mercury V75", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 149 },
    { model: "Mercury V75 Pro", size: "75%", switchType: "Mechanical", wireless: true, hotSwap: true, price: 179 },
    { model: "Mercury V75 HE", size: "75%", switchType: "Hall Effect", wireless: true, hotSwap: true, price: 199 },
  ]),
].sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));

export const brands = Array.from(new Set(keyboards.map((item) => item.brand)));
export const sizes = Array.from(new Set(keyboards.map((item) => item.size)));
