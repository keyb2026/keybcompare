export default function KeyboardCard({ keyboard, selected, onToggle }) {
  return (
    <article className="card">
      <div className="imageWrap">
        {keyboard.image ? (
          <img src={keyboard.image} alt={`${keyboard.brand} ${keyboard.name}`} className="image" />
        ) : (
          <div className="missing">
            <div className="missingIcon">⌁</div>
            <div>Photo not added yet</div>
          </div>
        )}
      </div>

      <div className="metaTop">
        <span className="brand">{keyboard.brand}</span>
        <span className="sizePill">{keyboard.size}</span>
      </div>

      <h3 className="title">{keyboard.name}</h3>

      <div className="pills">
        <span className="pill">{keyboard.switchType}</span>
        {keyboard.wireless && <span className="pill pillGreen">Wireless</span>}
        {keyboard.rapidTrigger && <span className="pill pillPurple">Rapid trigger</span>}
      </div>

      <div className="specBox">
        <div><span>Price</span><strong>${keyboard.price}</strong></div>
        <div><span>Latency</span><strong>{keyboard.latency}</strong></div>
        <div><span>Battery</span><strong>{keyboard.battery}</strong></div>
        <div><span>Sound</span><strong>{keyboard.sound}</strong></div>
      </div>

      <button className="action" onClick={() => onToggle(keyboard.id)}>
        {selected ? "Remove from compare" : "Add to compare"}
      </button>
    </article>
  );
}