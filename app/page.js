"use client";

import { useMemo, useState } from "react";
import { keyboards, brands } from "../lib/keyboards";
import KeyboardCard from "../components/KeyboardCard";
import CompareTable from "../components/CompareTable";

export default function Page() {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState([
    "wooting-80he",
    "keychron-q1-max",
    "razer-huntsman-v3-pro-tkl"
  ]);

  const filtered = useMemo(() => {
    return keyboards.filter((k) => {
      const matchesQuery =
        !query.trim() ||
        `${k.brand} ${k.name} ${k.size} ${k.switchType}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesBrand = brandFilter === "All" || k.brand === brandFilter;
      return matchesQuery && matchesBrand;
    });
  }, [query, brandFilter]);

  const selected = useMemo(
    () => keyboards.filter((k) => selectedIds.includes(k.id)),
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
        <div className="heroCopy">
          <div className="eyebrow">KBcompare</div>
          <h1>Compare keyboards side by side.</h1>
          <p className="heroText">
            Browse the catalog, pick up to four keyboards, and compare their
            specs in one place.
          </p>
          <div className="heroStats">
            <span>135 models</span>
            <span>20 brands</span>
            <span>Compare up to 4</span>
          </div>
        </div>

        <div className="heroSummary">
          <div className="summaryTitle">Selected now</div>
          {selected.length === 0 ? (
            <p className="muted">No keyboards selected yet.</p>
          ) : (
            <ul className="selectedList">
              {selected.map((k) => (
                <li key={k.id}>
                  <strong>{k.brand}</strong> {k.name}
                </li>
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
        <select
          className="brandSelect"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="All">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </section>

      <section className="mainLayout">
        <aside className="browserPanel">
          <div className="sectionHeader">
            <h2>Browse catalog</h2>
            <span>{filtered.length} shown</span>
          </div>
          <div className="browserList">
            {filtered.map((k) => {
              const active = selectedIds.includes(k.id);
              return (
                <button
                  key={k.id}
                  className={`browserItem ${active ? "browserItemActive" : ""}`}
                  onClick={() => toggleKeyboard(k.id)}
                >
                  <div>
                    <div className="browserName">
                      {k.brand} {k.name}
                    </div>
                    <div className="browserMeta">
                      {k.size} • {k.switchType}
                    </div>
                  </div>
                  <div className="browserAction">{active ? "✓" : "+"}</div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="compareArea">
          <div className="sectionHeader">
            <h2>Compare view</h2>
            <span>Only selected keyboards appear here</span>
          </div>

          {selected.length === 0 ? (
            <div className="emptyState">
              Select keyboards from the left to compare them here.
            </div>
          ) : (
            <>
              <div className="cardGrid">
                {selected.map((k) => (
                  <KeyboardCard
                    key={k.id}
                    keyboard={k}
                    selected={selectedIds.includes(k.id)}
                    onToggle={toggleKeyboard}
                  />
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
