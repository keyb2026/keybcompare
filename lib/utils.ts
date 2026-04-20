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

export function keyboardImageDataUri(brand: string, model: string, size: string) {
  const label = `${brand} ${model}`;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
      <linearGradient id="panel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="720" rx="40" fill="url(#bg)"/>
    <rect x="120" y="210" width="960" height="260" rx="30" fill="url(#panel)" stroke="#60a5fa" stroke-width="4"/>
    ${Array.from({length: 15}).map((_,i)=>`<rect x="${150+i*60}" y="245" width="44" height="36" rx="8" fill="#0b1220" stroke="#334155"/>`).join("")}
    ${Array.from({length: 14}).map((_,i)=>`<rect x="180+i*60}" y="295" width="44" height="36" rx="8" fill="#0b1220" stroke="#334155"/>`).join("")}
    ${Array.from({length: 13}).map((_,i)=>`<rect x="210+i*60}" y="345" width="44" height="36" rx="8" fill="#0b1220" stroke="#334155"/>`).join("")}
    <rect x="360" y="395" width="420" height="40" rx="10" fill="#0b1220" stroke="#334155"/>
    <text x="120" y="110" fill="#bfdbfe" font-size="40" font-family="Arial, Helvetica, sans-serif">KEYBCOMPARE</text>
    <text x="120" y="160" fill="#ffffff" font-size="64" font-weight="700" font-family="Arial, Helvetica, sans-serif">${label.replace(/&/g, "and")}</text>
    <text x="120" y="560" fill="#dbeafe" font-size="36" font-family="Arial, Helvetica, sans-serif">${size} keyboard • catalog placeholder image</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
