"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brands, keyboards, sizes, type Keyboard } from "@/data/keyboards";
import {
  BatteryCharging,
  ExternalLink,
  Gauge,
  ImageOff,
  Keyboard as KeyboardIcon,
  Layers3,
  Search,
  Sparkles,
  Volume2,
  Wifi,
  X,
} from "lucide-react";

const maxCompare = 4;
const imageCache = new Map<string, string | null>();

const specGroups: Array<{ title: string; columns: Array<[string, (item: Keyboard) => string]> }> = [
  {
    title: "Core specs",
    columns: [
      ["Brand", (item) => item.brand],
      ["Model", (item) => item.model],
      ["Size", (item) => item.size],
      ["Layout", (item) => item.layout],
      ["Profile", (item) => item.profile],
      ["Switch type", (item) => item.switchType],
      ["Connection", (item) => item.connection.join(", ")],
      ["Wireless", (item) => (item.wireless ? "Yes" : "No")],
      ["Hot-swap", (item) => (item.hotSwap ? "Yes" : "No")],
      ["Price", (item) => `$${item.price}`],
    ],
  },
  {
    title: "Performance",
    columns: [
      ["Polling rate", (item) => `${item.pollingRateHz.toLocaleString()} Hz`],
      ["Estimated latency", (item) => `${item.latencyMs} ms`],
      ["Rapid trigger", (item) => (item.rapidTrigger ? "Yes" : "No")],
      ["Actuation range", (item) => item.actuationRangeMm],
      ["Battery life", (item) => (item.batteryHours === null ? "Wired only" : `${item.batteryHours} hrs`)],
      ["Software", (item) => item.software],
      ["Backlight", (item) => item.backlight],
    ],
  },
  {
    title: "Build & sound",
    columns: [
      ["Mounting", (item) => item.mounting],
      ["Case material", (item) => item.caseMaterial],
      ["Plate material", (item) => item.plateMaterial],
      ["Keycap material", (item) => item.keycapMaterial],
      ["Sound profile", (item) => item.soundProfile],
      ["Weight", (item) => `${item.weightG} g`],
      ["Dimensions", (item) => item.dimensions],
      ["Knob", (item) => (item.knob ? "Yes" : "No")],
      ["Display", (item) => (item.display ? "Yes" : "No")],
    ],
  },
];

function compareSummary(selected: Keyboard[]) {
  if (selected.length === 0) return "Start with one board, then add up to three more to compare price, latency, battery life, sound, and build.";
  if (selected.length === 1) return `${selected[0].brand} ${selected[0].model} is ready to compare. Add more keyboards to see trade-offs side by side.`;

  const cheapest = [...selected].sort((a, b) => a.price - b.price)[0];
  const fastest = [...selected].sort((a, b) => a.latencyMs - b.latencyMs)[0];
  const longestBattery = [...selected].filter((item) => item.batteryHours !== null).sort((a, b) => (b.batteryHours ?? 0) - (a.batteryHours ?? 0))[0];
  const mostPremium = [...selected].sort((a, b) => b.price - a.price)[0];

  return `${cheapest.brand} ${cheapest.model} is the cheapest at $${cheapest.price}. ${fastest.brand} ${fastest.model} is the quickest on paper at ${fastest.latencyMs} ms. ${longestBattery ? `${longestBattery.brand} ${longestBattery.model} has the strongest battery claim at ${longestBattery.batteryHours} hours.` : "These are wired-first boards."} ${mostPremium.brand} ${mostPremium.model} sits at the premium end of this group.`;
}

function toneClass(item: Keyboard) {
  if (/hall|magnetic|analog/i.test(item.switchType)) return "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100";
  if (/low-profile/i.test(item.switchType)) return "border-cyan-400/20 bg-cyan-400/10 text-cyan-100";
  if (/membrane/i.test(item.switchType)) return "border-amber-400/20 bg-amber-400/10 text-amber-100";
  return "border-slate-700 bg-slate-800 text-slate-200";
}

function metricCard(label: string, value: string, icon: ReactNode) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
      <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">{icon}{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function useResolvedImage(item: Keyboard) {
  const [resolved, setResolved] = useState<string | null>(item.imageVerified ? item.image : null);

  useEffect(() => {
    if (item.imageVerified) {
      setResolved(item.image);
      return;
    }
    if (!item.officialUrl) {
      setResolved(null);
      return;
    }
    const key = `${item.id}:${item.officialUrl}`;
    if (imageCache.has(key)) {
      setResolved(imageCache.get(key) ?? null);
      return;
    }
    let active = true;
    fetch(`/api/official-image?url=${encodeURIComponent(item.officialUrl)}&model=${encodeURIComponent(item.model)}`)
      .then((res) => res.json())
      .then((data) => {
        const next = data?.imageUrl ?? null;
        imageCache.set(key, next);
        if (active) setResolved(next);
      })
      .catch(() => {
        imageCache.set(key, null);
        if (active) setResolved(null);
      });
    return () => {
      active = false;
    };
  }, [item.id, item.image, item.imageVerified, item.model, item.officialUrl]);

  return resolved;
}

function ProductImage({ item, ratio = "aspect-[4/3]" }: { item: Keyboard; ratio?: string }) {
  const resolved = useResolvedImage(item);

  if (!resolved) {
    return (
      <div className={`${ratio} flex items-center justify-center rounded-[28px] border border-dashed border-slate-800 bg-slate-950/80 text-center`}>
        <div className="px-5 text-slate-500">
          <ImageOff className="mx-auto mb-3 h-5 w-5" />
          <div className="text-sm font-medium text-slate-300">Photo not added yet</div>
          <div className="mt-1 text-xs text-slate-500">{item.brand} {item.model}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${ratio} overflow-hidden rounded-[28px] border border-slate-800 bg-white`}>
      <img src={resolved} alt={`${item.brand} ${item.model}`} className="h-full w-full object-contain p-4" loading="lazy" />
    </div>
  );
}

export function CatalogApp() {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("All brands");
  const [sizeFilter, setSizeFilter] = useState("All sizes");
  const [wirelessOnly, setWirelessOnly] = useState(false);
  const [rapidOnly, setRapidOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(["wooting-80he", "keychron-q1-max", "razer-huntsman-v3-pro-tkl", "akko-5075b-plus"]);
  const [visibleCount, setVisibleCount] = useState(24);

  const filtered = useMemo(() => {
    return keyboards.filter((item) => {
      const haystack = `${item.brand} ${item.model} ${item.size} ${item.switchType} ${item.tags.join(" ")} ${item.notes}`.toLowerCase();
      return haystack.includes(query.toLowerCase())
        && (brandFilter === "All brands" || item.brand === brandFilter)
        && (sizeFilter === "All sizes" || item.size === sizeFilter)
        && (!wirelessOnly || item.wireless)
        && (!rapidOnly || item.rapidTrigger);
    });
  }, [query, brandFilter, rapidOnly, sizeFilter, wirelessOnly]);

  const selected = selectedIds.map((id) => keyboards.find((item) => item.id === id)).filter(Boolean) as Keyboard[];

  useEffect(() => {
    setVisibleCount(24);
  }, [query, brandFilter, sizeFilter, wirelessOnly, rapidOnly]);

  const visible = filtered.slice(0, visibleCount);

  const toggleKeyboard = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((entry) => entry !== id);
      if (current.length >= maxCompare) return [...current.slice(1), id];
      return [...current, id];
    });
  };

  const featured = useMemo(() => ({
    lowestLatency: [...filtered].sort((a, b) => a.latencyMs - b.latencyMs)[0],
    bestBattery: [...filtered].filter((item) => item.batteryHours !== null).sort((a, b) => (b.batteryHours ?? 0) - (a.batteryHours ?? 0))[0],
    bestValue: [...filtered].sort((a, b) => a.price - b.price)[0],
  }), [filtered]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3 text-slate-100">
              <KeyboardIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.22em] text-slate-200">KBCOMPARE</div>
              <div className="text-xs text-slate-500">Keyboard comparison database</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-slate-300">{keyboards.length} models</Badge>
            <Badge className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-slate-300">{brands.length} brands</Badge>
          </div>
        </header>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-slate-800 bg-slate-900/60 shadow-none">
            <CardHeader className="pb-4">
              <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-400">
                <Sparkles className="h-3.5 w-3.5" />
                Official-page image importer enabled
              </div>
              <CardTitle className="max-w-4xl text-4xl leading-tight text-white md:text-6xl">A cleaner way to compare keyboards.</CardTitle>
              <CardDescription className="max-w-3xl pt-2 text-base text-slate-400 md:text-lg">
                Browse 135 models, pull official imagery where the brand page exposes it, and compare deeper specs like latency, sound profile, battery life, actuation, materials, and software.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {metricCard("Catalog", `${keyboards.length} starter models`, <Layers3 className="h-3.5 w-3.5" />)}
              {metricCard("Battery", "Wireless hours included", <BatteryCharging className="h-3.5 w-3.5" />)}
              {metricCard("Sound", "Profile and build notes", <Volume2 className="h-3.5 w-3.5" />)}
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Compare rail</CardTitle>
              <CardDescription className="text-slate-400">{compareSummary(selected)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950/80 p-3">
                  <div>
                    <div className="font-medium text-white">{item.brand} {item.model}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-slate-700 text-slate-300">{item.size}</Badge>
                      <Badge className={toneClass(item)}>{item.switchType}</Badge>
                      {item.wireless && <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">Wireless</Badge>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-900 hover:text-white" onClick={() => toggleKeyboard(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">Fastest</div>
                  <div className="text-sm font-medium text-white">{featured.lowestLatency ? `${featured.lowestLatency.brand} ${featured.lowestLatency.model}` : "—"}</div>
                  <div className="text-sm text-slate-400">{featured.lowestLatency ? `${featured.lowestLatency.latencyMs} ms` : "—"}</div>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">Best battery</div>
                  <div className="text-sm font-medium text-white">{featured.bestBattery ? `${featured.bestBattery.brand} ${featured.bestBattery.model}` : "—"}</div>
                  <div className="text-sm text-slate-400">{featured.bestBattery ? `${featured.bestBattery.batteryHours} hrs` : "Wired only"}</div>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">Best value</div>
                  <div className="text-sm font-medium text-white">{featured.bestValue ? `${featured.bestValue.brand} ${featured.bestValue.model}` : "—"}</div>
                  <div className="text-sm text-slate-400">{featured.bestValue ? `$${featured.bestValue.price}` : "—"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <Card className="h-fit border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Browse keyboards</CardTitle>
              <CardDescription className="text-slate-400">Search by model, size, switch type, sound, or brand.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brand, model, switch, sound..." className="h-11 rounded-2xl border-slate-800 bg-slate-950 pl-9 text-slate-100 placeholder:text-slate-500" />
              </div>

              <div className="grid gap-3">
                <label className="grid gap-2 text-sm">
                  <span className="text-slate-400">Brand</span>
                  <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="h-11 rounded-2xl border border-slate-800 bg-slate-950 px-3 text-slate-100 outline-none">
                    <option>All brands</option>
                    {brands.map((brand) => <option key={brand}>{brand}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-slate-400">Size</span>
                  <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className="h-11 rounded-2xl border border-slate-800 bg-slate-950 px-3 text-slate-100 outline-none">
                    <option>All sizes</option>
                    {sizes.map((size) => <option key={size}>{size}</option>)}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <button onClick={() => setWirelessOnly((v) => !v)} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${wirelessOnly ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-slate-800 bg-slate-950 text-slate-300"}`}>
                  <Wifi className="h-4 w-4" /> Wireless only
                </button>
                <button onClick={() => setRapidOnly((v) => !v)} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${rapidOnly ? "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-100" : "border-slate-800 bg-slate-950 text-slate-300"}`}>
                  <Gauge className="h-4 w-4" /> Rapid trigger only
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => {
              const active = selectedIds.includes(item.id);
              return (
                <Card key={item.id} className={`overflow-hidden border transition ${active ? "border-slate-600 bg-slate-900" : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"}`}>
                  <CardContent className="p-4">
                    <ProductImage item={item} />
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.brand}</div>
                        <h3 className="mt-1 text-lg font-semibold text-white">{item.model}</h3>
                      </div>
                      <Badge variant="outline" className="border-slate-700 text-slate-300">{item.size}</Badge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className={toneClass(item)}>{item.switchType}</Badge>
                      {item.wireless && <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-100">Wireless</Badge>}
                      {item.rapidTrigger && <Badge className="border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100">Rapid trigger</Badge>}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm">
                      <div>
                        <div className="text-slate-500">Price</div>
                        <div className="mt-1 font-medium text-white">${item.price}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Latency</div>
                        <div className="mt-1 font-medium text-white">{item.latencyMs} ms</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Battery</div>
                        <div className="mt-1 font-medium text-white">{item.batteryHours === null ? "Wired" : `${item.batteryHours} hrs`}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Sound</div>
                        <div className="mt-1 font-medium text-white">{item.soundProfile}</div>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-400">{item.notes}</p>

                    <div className="mt-4 flex gap-2">
                      <Button variant={active ? "secondary" : "default"} className="flex-1 rounded-2xl" onClick={() => toggleKeyboard(item.id)}>
                        {active ? "Remove from compare" : "Add to compare"}
                      </Button>
                      {item.officialUrl && (
                        <Button variant="outline" className="rounded-2xl border-slate-700 text-slate-200" onClick={() => window.open(item.officialUrl, "_blank")}> 
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {visibleCount < filtered.length && (
          <div className="mb-8 flex justify-center">
            <Button variant="outline" className="rounded-2xl border-slate-700 text-slate-200" onClick={() => setVisibleCount((count) => count + 24)}>
              Load 24 more keyboards
            </Button>
          </div>
        )}

        <section className="space-y-6">
          {specGroups.map((group) => (
            <Card key={group.title} className="overflow-hidden border-slate-800 bg-slate-900/60">
              <CardHeader className="border-b border-slate-800 bg-slate-950/60">
                <CardTitle className="text-2xl text-white">{group.title}</CardTitle>
                <CardDescription className="text-slate-400">Side-by-side details for the selected boards.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-950/50">
                        <th className="w-48 px-4 py-4 text-left font-medium text-slate-400">Metric</th>
                        {selected.map((item) => (
                          <th key={item.id} className="min-w-[220px] px-4 py-4 text-left">
                            <div className="font-medium text-white">{item.brand} {item.model}</div>
                            <div className="mt-1 text-xs text-slate-500">{item.size} · {item.switchType}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {group.columns.map(([label, getter], index) => (
                        <tr key={label} className={index % 2 === 0 ? "bg-slate-900/30" : "bg-slate-950/50"}>
                          <td className="border-t border-slate-800 px-4 py-3 font-medium text-slate-300">{label}</td>
                          {selected.map((item) => (
                            <td key={`${item.id}-${label}`} className="border-t border-slate-800 px-4 py-3 text-slate-200">{getter(item)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
