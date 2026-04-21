"use client";

import { useMemo, useState } from "react";
import { keyboards } from "../lib/keyboards";
import KeyboardCard from "../components/KeyboardCard";

export default function Page() {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(["wooting-80he", "keychron-q1-max"]);

  const selected = useMemo(
    () => keyboards.filter((k) => selectedIds.includes(k.id)),
    [selectedIds]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return keyboards;
    return keyboards.filter((k) =>
      `${k.brand} ${k.name} ${k.size} ${k.switchType}`.toLowerCase().includes(q)
    );
  }, [query]);

  function toggleKeyboard(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id].slice(-4)
    );
  }

  return (
    <main className="page">
      <header className="hero">
        <div>
          <div className="eyebrow">KBcompare</div>
          <h1>Stable rebuild that should actually deploy</h1>
          <p>
            Plain JavaScript Next.js build. No TypeScript. No duplicate routes.
            No broken runtime image scraping. The compare area only shows selected keyboards.
          </p>
        </div>
        <div className="summary">
          <h2>Selected keyboards</h2>
          {selected.length === 0 ? (
            <p>No keyboards selected.</p>
          ) : (
            <ul>
              {selected.map((k) => (
                <li key={k.id}>{k.brand} {k.name}</li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <section className="controls">
        <input
          className="search"
          placeholder="Search brand, model, size, switch..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </section>

      <section className="content">
        <aside className="sidebar">
          <h2>Browse keyboards</h2>
          <div className="sidebarList">
            {filtered.map((keyboard) => (
              <button
                key={keyboard.id}
                className={`sideItem ${selectedIds.includes(keyboard.id) ? "sideItemActive" : ""}`}
                onClick={() => toggleKeyboard(keyboard.id)}
              >
                <div>
                  <strong>{keyboard.brand} {keyboard.name}</strong>
                  <div className="sideSub">{keyboard.size} • {keyboard.switchType}</div>
                </div>
                <span>{selectedIds.includes(keyboard.id) ? "✓" : "+"}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="mainGrid">
          <h2>Compare view</h2>
          {selected.length === 0 ? (
            <div className="empty">Pick keyboards from the left to compare.</div>
          ) : (
            <div className="grid">
              {selected.map((keyboard) => (
                <KeyboardCard
                  key={keyboard.id}
                  keyboard={keyboard}
                  selected={selectedIds.includes(keyboard.id)}
                  onToggle={toggleKeyboard}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}