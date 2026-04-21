export default function KeyboardCard({ keyboard, selected, onToggle }) {
  const initials = keyboard.brand
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="keyboardCard">
      <div className="imageFrame">
        <div className="fakeImage">
          <div className="fakeLogo">{initials}</div>
          <div className="fakeModel">{keyboard.name}</div>
          <div className="fakeSub">{keyboard.size}</div>
        </div>
      </div>

      <div className="cardTopline">
        <span className="brandLabel">{keyboard.brand}</span>
        <span className="sizeBadge">{keyboard.size}</span>
      </div>

      <h3 className="cardTitle">{keyboard.name}</h3>

      <div className="tagRow">
        <span className="tag">{keyboard.switchType}</span>
        {keyboard.wireless ? <span className="tag tagAlt">Wireless</span> : <span className="tag tagMuted">Wired</span>}
      </div>

      <div className="miniSpecs">
        <div><span>Latency</span><strong>{keyboard.latency}</strong></div>
        <div><span>Battery</span><strong>{keyboard.battery}</strong></div>
        <div><span>Polling</span><strong>{keyboard.polling}</strong></div>
        <div><span>Sound</span><strong>{keyboard.sound}</strong></div>
      </div>

      <button className="primaryBtn" onClick={() => onToggle(keyboard.id)}>
        {selected ? "Remove from compare" : "Add to compare"}
      </button>
    </article>
  );
}