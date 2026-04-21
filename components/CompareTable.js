const rows = [
  ["Brand", (keyboard) => keyboard.brand],
  ["Model", (keyboard) => keyboard.name],
  ["Size", (keyboard) => keyboard.size],
  ["Switch type", (keyboard) => keyboard.switchType],
  ["Wireless", (keyboard) => (keyboard.wireless ? "Yes" : "No")],
  ["Latency", (keyboard) => keyboard.latency],
  ["Battery", (keyboard) => keyboard.battery],
  ["Polling", (keyboard) => keyboard.polling],
  ["Sound", (keyboard) => keyboard.sound],
  ["Mount", (keyboard) => keyboard.mount],
  ["Case material", (keyboard) => keyboard.material],
  ["Price", (keyboard) => keyboard.price]
];

export default function CompareTable({ selected }) {
  return (
    <div className="tableWrap">
      <table className="compareTable">
        <thead>
          <tr>
            <th>Spec</th>
            {selected.map((keyboard) => (
              <th key={keyboard.id}>{keyboard.brand} {keyboard.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, getter]) => (
            <tr key={label}>
              <td>{label}</td>
              {selected.map((keyboard) => (
                <td key={`${keyboard.id}-${label}`}>{getter(keyboard)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}