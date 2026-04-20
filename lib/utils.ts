import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function accentFromBrand(brand: string) {
  const palette = {
    Logitech: ["#22c55e", "#166534"],
    Razer: ["#84cc16", "#365314"],
    Corsair: ["#f59e0b", "#78350f"],
    SteelSeries: ["#f97316", "#7c2d12"],
    ASUS: ["#ef4444", "#7f1d1d"],
    Keychron: ["#3b82f6", "#1e3a8a"],
    Wooting: ["#8b5cf6", "#4c1d95"],
    Akko: ["#ec4899", "#831843"],
    NuPhy: ["#06b6d4", "#164e63"],
    Glorious: ["#a855f7", "#581c87"],
    Ducky: ["#f43f5e", "#881337"],
    Epomaker: ["#14b8a6", "#134e4a"],
    HyperX: ["#ef4444", "#7f1d1d"],
    "Royal Kludge": ["#f97316", "#7c2d12"],
    "Cooler Master": ["#60a5fa", "#1e3a8a"],
    MonsGeek: ["#22c55e", "#14532d"],
    Lemokey: ["#eab308", "#713f12"],
    DrunkDeer: ["#fb7185", "#881337"],
    Gamakay: ["#2dd4bf", "#115e59"],
    GravaStar: ["#c084fc", "#581c87"],
  } as Record<string, [string, string]>;

  return palette[brand] ?? ["#60a5fa", "#1e293b"];
}

function renderKeyRows(count: number, startX: number, y: number, width: number, gap: number) {
  return Array.from({ length: count })
    .map(
      (_, index) =>
        `<rect x="${startX + index * (width + gap)}" y="${y}" width="${width}" height="34" rx="7" fill="#09111f" stroke="#334155"/>`,
    )
    .join("");
}

export function keyboardImageDataUri(brand: string, model: string, size: string, variant: "hero" | "top" | "side" = "hero") {
  const [accent, deep] = accentFromBrand(brand);
  const label = `${brand} ${model}`.replace(/&/g, "and");

  const topBoard = `
    <rect x="130" y="185" width="940" height="285" rx="34" fill="#0b1220" stroke="${accent}" stroke-width="4"/>
    ${renderKeyRows(16, 162, 220, 38, 12)}
    ${renderKeyRows(15, 182, 268, 38, 12)}
    ${renderKeyRows(14, 202, 316, 38, 12)}
    ${renderKeyRows(12, 242, 364, 38, 12)}
    <rect x="395" y="412" width="410" height="38" rx="10" fill="#07101b" stroke="#334155"/>
  `;

  const sideBoard = `
    <path d="M170 430 C250 290, 420 245, 760 260 C910 266, 1015 314, 1080 430 L1035 485 L210 485 Z" fill="#0b1220" stroke="${accent}" stroke-width="4"/>
    <rect x="220" y="475" width="780" height="10" rx="5" fill="${accent}" opacity="0.65"/>
    <path d="M220 420 C285 350, 370 334, 496 326" stroke="#1f2937" stroke-width="14" stroke-linecap="round"/>
  `;

  const board = variant === "side" ? sideBoard : topBoard;
  const descriptor = variant === "side" ? "side profile placeholder" : variant === "top" ? "top view placeholder" : "catalog placeholder";

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#050816"/>
        <stop offset="55%" stop-color="${deep}"/>
        <stop offset="100%" stop-color="#020617"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="0%" r="90%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="720" rx="42" fill="url(#bg)"/>
    <circle cx="900" cy="50" r="380" fill="url(#glow)"/>
    <rect x="54" y="54" width="1092" height="612" rx="34" fill="rgba(15,23,42,0.28)" stroke="rgba(255,255,255,0.08)"/>
    <text x="88" y="108" fill="#cbd5e1" font-size="34" font-family="Arial, Helvetica, sans-serif">KEYBCOMPARE</text>
    <text x="88" y="164" fill="#ffffff" font-size="58" font-weight="700" font-family="Arial, Helvetica, sans-serif">${label}</text>
    <text x="88" y="208" fill="#cbd5e1" font-size="28" font-family="Arial, Helvetica, sans-serif">${size} keyboard · ${descriptor}</text>
    ${board}
    <g transform="translate(88 576)">
      <rect width="172" height="48" rx="24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)"/>
      <text x="26" y="31" fill="#ffffff" font-size="24" font-family="Arial, Helvetica, sans-serif">${size}</text>
    </g>
    <g transform="translate(276 576)">
      <rect width="244" height="48" rx="24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)"/>
      <text x="24" y="31" fill="#ffffff" font-size="24" font-family="Arial, Helvetica, sans-serif">${brand}</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
