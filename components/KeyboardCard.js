export default function KeyboardCard({ keyboard, selected, onToggle }) {
return (
<article className="keyboardCard">
<div className="imageFrame">
{keyboard.image ? (
<img
src={keyboard.image}
alt={`${keyboard.brand} ${keyboard.name}`}
className="photo"
/>
) : (
<div className="missingPhoto">
<div className="missingIcon">⌁<
<div>Photo not added yet<
</d
iv>
)}
</d
iv>
/div>
/div>
<div className="cardTopline">
<span className="brandLabel">{keyboard.brand}<
/span>
<span className="sizeBadge">{keyboard.size}<
/span>
</d
iv>
<h3 className="cardTitle">{keyboard.name}<
/h3>
<div className="tagRow">
<span className="tag">{keyboard.switchType}<
/span>
{keyboard.wireless ? (
<span className="tag tagAlt">Wireless<
/span>
) : (
<span className="tag tagMuted">Wired<
/span>
5
)}
</d
iv>
<div className="miniSpecs">
<div>
<span>Latency<
/span>
<strong>{keyboard.latency}<
</d
iv>
<div>
<span>Battery<
/strong>
/span>
<strong>{keyboard.battery}<
</d
/strong>
iv>
<div>
<span>Polling<
/span>
<strong>{keyboard.polling}<
</d
/strong>
iv>
<div>
<span>Sound<
/span>
<strong>{keyboard.sound}<
</d
/strong>
iv>
</d
iv>
<button className="primaryBtn" onClick={() => onToggle(keyboard.id)}>
{selected ? "Remove from compare" : "Add to compare"}
</
button>
</
article>
);
}
