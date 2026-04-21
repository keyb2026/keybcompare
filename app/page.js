"use client";
import { useMemo, useState } from "react";
import { keyboards, brands } from "../lib/keyboards";
import KeyboardCard from "../components/KeyboardCard";
import CompareTable from "../components/CompareTable";

export default function Page() {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState(["wooting-80he", "keychron-q1-max", "razer-huntsman-v3-pro-tkl"]);

  const filtered = useMemo(() => {
    return keyboards.filter((keyboard) => {
      const matchesQuery =
        !query.trim() ||
        `${keyboard.brand} ${keyboard.name} ${keyboard.size} ${keyboard.switchType}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesBrand = brandFilter === "All" || keyboard.brand === brandFilter;
      return matchesQuery && matchesBrand;
    });
  }, [query, brandFilter]);

  const selected = useMemo(
    () => keyboards.filter((keyboard) => selectedIds.includes(keyboard.id)),
    [selectedIds]
  );

  function toggleKeyboard(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id].slice(-4)
    );
  }

  return (
    <main className="pageShell">
      <header className="hero">
        <div>
          <div className="eyebrow">KBcompare</div>
          <h1>V6 Final, local image assets, stable deploy.</h1>
          <p className="heroText">
            Every card now uses a bundled local image file, so there are no broken hotlinks on Vercel.
            Compare only the keyboards you actually selected.
          </p>
          <div className="heroStats">
            <span>135 models</span>
            <span>20 brands</span>
            <span>Local images for every card</span>
          </div>
        </div>

        <div className="summaryCard">
          <div className="summaryTitle">Selected now</div>
          {selected.length === 0 ? (
            <p className="muted">No keyboards selected yet.</p>
          ) : (
            <ul className="selectedList">
              {selected.map((keyboard) => (
                <li key={keyboard.id}><strong>{keyboard.brand}</strong> {keyboard.name}</li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <section className="toolbar">
        <input
          className="searchInput"
          placeholder="Search brand, model, size, switch..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="brandSelect" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
          <option value="All">All brands</option>
          {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
        </select>
      </section>

      <section className="mainLayout">
        <aside className="browserPanel">
          <div className="sectionHeader"><h2>Browse catalog</h2><span>{filtered.length} shown</span></div>
          <div className="browserList">
            {filtered.map((keyboard) => {
              const active = selectedIds.includes(keyboard.id);
              return (
                <button key={keyboard.id} className={`browserItem ${active ? "browserItemActive" : ""}`} onClick={() => toggleKeyboard(keyboard.id)}>
                  <div>
                    <div className="browserName">{keyboard.brand} {keyboard.name}</div>
                    <div className="browserMeta">{keyboard.size} • {keyboard.switchType}</div>
                  </div>
                  <div className="browserAction">{active ? "✓" : "+"}</div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="compareArea">
          <div className="sectionHeader"><h2>Compare view</h2><span>Only selected keyboards appear here</span></div>
          {selected.length === 0 ? (
            <div className="emptyState">Select keyboards from the left to compare them here.</div>
          ) : (
            <>
              <div className="cardGrid">
                {selected.map((keyboard) => (
                  <KeyboardCard key={keyboard.id} keyboard={keyboard} selected={selectedIds.includes(keyboard.id)} onToggle={toggleKeyboard} />
                ))}
              </div>
              <CompareTable selected={selected} />
            </>
          )}
        </section>
      </section>
    </main>
  );
}