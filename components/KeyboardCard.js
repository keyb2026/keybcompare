export default function KeyboardCard({ keyboard, selected, onToggle }) {
  const showImage = keyboard.image || keyboard.fallbackImage;
  return (
    <article className="keyboardCard">
      <div className="imageFrame">
        {showImage ? (
          <img src={showImage} alt={`${keyboard.brand} ${keyboard.name}`} className="photo" />
        ) : (
          <div className="missingPhoto">
            <div className="missingIcon">⌁</div>
            <div>Photo not added yet</div>
          </div>
        )}
        {!keyboard.image && keyboard.fallbackImage ? <div className="fallbackBadge">Brand fallback</div> : null}
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