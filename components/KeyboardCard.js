import { useMemo, useState, useEffect } from "react";

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildFallbackSvg(brand, name, size) {
  const safeBrand = escapeXml(brand || "Keyboard");
  const safeName = escapeXml(name || "Model");
  const safeSize = escapeXml(size || "");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eef4ff"/>
          <stop offset="100%" stop-color="#dbe8ff"/>
        </linearGradient>
        <linearGradient id="board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#25344f"/>
          <stop offset="100%" stop-color="#111827"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="720" fill="url(#bg)"/>
      <rect x="110" y="160" rx="32" ry="32" width="980" height="360" fill="url(#board)"/>
      <rect x="160" y="210" rx="14" ry="14" width="880" height="260" fill="#0b1220"/>

      <g fill="#f8fbff">
        <rect x="190" y="238" rx="8" width="62" height="40"/>
        <rect x="264" y="238" rx="8" width="62" height="40"/>
        <rect x="338" y="238" rx="8" width="62" height="40"/>
        <rect x="412" y="238" rx="8" width="62" height="40"/>
        <rect x="486" y="238" rx="8" width="62" height="40"/>
        <rect x="560" y="238" rx="8" width="62" height="40"/>
        <rect x="634" y="238" rx="8" width="62" height="40"/>
        <rect x="708" y="238" rx="8" width="62" height="40"/>
        <rect x="782" y="238" rx="8" width="62" height="40"/>
        <rect x="856" y="238" rx="8" width="62" height="40"/>

        <rect x="190" y="292" rx="8" width="88" height="40"/>
        <rect x="290" y="292" rx="8" width="62" height="40"/>
        <rect x="364" y="292" rx="8" width="62" height="40"/>
        <rect x="438" y="292" rx="8" width="62" height="40"/>
        <rect x="512" y="292" rx="8" width="62" height="40"/>
        <rect x="586" y="292" rx="8" width="62" height="40"/>
        <rect x="660" y="292" rx="8" width="62" height="40"/>
        <rect x="734" y="292" rx="8" width="62" height="40"/>
        <rect x="808" y="292" rx="8" width="62" height="40"/>
        <rect x="882" y="292" rx="8" width="62" height="40"/>

        <rect x="190" y="346" rx="8" width="108" height="40"/>
        <rect x="310" y="346" rx="8" width="62" height="40"/>
        <rect x="384" y="346" rx="8" width="62" height="40"/>
        <rect x="458" y="346" rx="8" width="62" height="40"/>
        <rect x="532" y="346" rx="8" width="62" height="40"/>
        <rect x="606" y="346" rx="8" width="62" height="40"/>
        <rect x="680" y="346" rx="8" width="62" height="40"/>
        <rect x="754" y="346" rx="8" width="62" height="40"/>
        <rect x="828" y="346" rx="8" width="116" height="40"/>

        <rect x="190" y="400" rx="8" width="136" height="40"/>
        <rect x="338" y="400" rx="8" width="62" height="40"/>
        <rect x="412" y="400" rx="8" width="62" height="40"/>
        <rect x="486" y="400" rx="8" width="62" height="40"/>
        <rect x="560" y="400" rx="8" width="62" height="40"/>
        <rect x="634" y="400" rx="8" width="230" height="40"/>
        <rect x="876" y="400" rx="8" width="68" height="40"/>
      </g>

      <text x="110" y="95" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#14223f">${safeBrand}</text>
      <text x="110" y="132" font-family="Arial, sans-serif" font-size="28" fill="#39527e">${safeName}</text>
      <text x="990" y="608" text-anchor="end" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#4c6da8">${safeSize}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function KeyboardCard({ keyboard, selected, onToggle }) {
  const fallbackImage = useMemo(
    () => buildFallbackSvg(keyboard.brand, keyboard.name, keyboard.size),
    [keyboard.brand, keyboard.name, keyboard.size]
  );

  const [imgSrc, setImgSrc] = useState(keyboard.image || fallbackImage);

  useEffect(() => {
    setImgSrc(keyboard.image || fallbackImage);
  }, [keyboard.image, fallbackImage]);

  return (
    <article className="keyboardCard">
      <div className="imageFrame">
        <img
          src={imgSrc}
          alt={`${keyboard.brand} ${keyboard.name}`}
          className="photo"
          loading="lazy"
          onError={() => setImgSrc(fallbackImage)}
        />
      </div>

      <div className="cardTopline">
        <span className="brandLabel">{keyboard.brand}</span>
        <span className="sizeBadge">{keyboard.size}</span>
      </div>

      <h3 className="cardTitle">{keyboard.name}</h3>

      <div className="tagRow">
        <span className="tag">{keyboard.switchType}</span>
        {keyboard.wireless ? (
          <span className="tag tagAlt">Wireless</span>
        ) : (
          <span className="tag tagMuted">Wired</span>
        )}
      </div>

      <div className="miniSpecs">
        <div>
          <span>Latency</span>
          <strong>{keyboard.latency}</strong>
        </div>
        <div>
          <span>Battery</span>
          <strong>{keyboard.battery}</strong>
        </div>
        <div>
          <span>Polling</span>
          <strong>{keyboard.polling}</strong>
        </div>
        <div>
          <span>Sound</span>
          <strong>{keyboard.sound}</strong>
        </div>
      </div>

      <button className="primaryBtn" onClick={() => onToggle(keyboard.id)}>
        {selected ? "Remove from compare" : "Add to compare"}
      </button>
    </article>
  );
}
