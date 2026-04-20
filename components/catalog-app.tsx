"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brands, keyboards, sizes, type Keyboard } from "@/data/keyboards";
import {
  BatteryCharging,
  Check,
  Gauge,
  Keyboard as KeyboardIcon,
  Layers3,
  Search,
  Volume2,
  Wifi,
  ExternalLink,
  X,
  ImageOff,
} from "lucide-react";

const maxCompare = 4;

const specGroups: Array<{
  title: string;
  columns: Array<[string, (item: Keyboard) => string]>;
}> = [
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
      ["Software", (item) => item.software],
      ["Backlight", (item) => item.backlight],
      ["Battery life", (item) => (item.batteryHours === null ? "Wired only" : `${item.batteryHours} hrs`)],
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
  if (selected.length === 0) return "Search the catalog and start selecting keyboards to compare.";
  if (selected.length === 1) {
    return `${selected[0].brand} ${selected[0].model} is ready to compare. Add up to three more keyboards to see trade-offs in sound, battery life, build, and performance.`;
  }

  const cheapest = [...selected].sort((a, b) => a.price - b.price)[0];
  const fastest = [...selected].sort((a, b) => a.latencyMs - b.latencyMs)[0];
  const longestBattery = [...selected]
    .filter((item) => item.batteryHours !== null)
    .sort((a, b) => (b.batteryHours ?? 0) - (a.batteryHours ?? 0))[0];
  const heCount = selected.filter((item) => item.rapidTrigger).length;
  return `${cheapest.brand} ${cheapest.model} is the lowest-priced pick at $${cheapest.price}. ${fastest.brand} ${fastest.model} is the quickest on paper at ${fastest.latencyMs} ms. ${longestBattery ? `${longestBattery.brand} ${longestBattery.model} leads battery life at ${longestBattery.batteryHours} hours.` : "These are all wired-first boards."} ${heCount} of ${selected.length} selected keyboards support adjustable actuation or rapid trigger behavior.`;
}

function formatSwitchTone(item: Keyboard) {
  if (/hall|magnetic|analog/i.test(item.switchType)) return "bg-violet-500/10 text-violet-200 border-violet-500/20";
  if (/low-profile/i.test(item.switchType)) return "bg-cyan-500/10 text-cyan-200 border-cyan-500/20";
  if (/membrane/i.test(item.switchType)) return "bg-amber-500/10 text-amber-200 border-amber-500/20";
  return "bg-slate-500/10 text-slate-200 border-slate-400/20";
}

function metricCard(label: string, value: string, icon: ReactNode) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">{icon}{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function ProductImage({ item, src, alt, ratio = "aspect-[4/3]", padded = true }: { item: Keyboard; src: string; alt: string; ratio?: string; padded?: boolean }) {
  if (!item.imageVerified) {
    return (
      <div className={`${ratio} flex items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950 text-center text-slate-500`}>
        <div>
          <ImageOff className="mx-auto mb-2 h-5 w-5" />
          <div className="text-sm font-medium text-slate-300">Photo not added yet</div>
          <div className="mt-1 text-xs text-slate-500">{item.brand} {item.model}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${ratio} overflow-hidden rounded-2xl border border-slate-800 bg-white`}>
      <img src={src} alt={alt} className={`h-full w-full ${padded ? "object-contain p-4" : "object-cover"}`} loading="lazy" />
    </div>
  );
}

export function CatalogApp() {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("All brands");
  const [sizeFilter, setSizeFilter] = useState("All sizes");
  const [wirelessOnly, setWirelessOnly] = useState(false);
  const [rapidOnly, setRapidOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "wooting-80he",
    "keychron-q1-max",
    "razer-huntsman-v3-pro-tkl",
    "akko-5075b-plus",
  ]);

  const filtered = useMemo(() => {
    return keyboards.filter((item) => {
      const haystack = `${item.brand} ${item.model} ${item.size} ${item.switchType} ${item.tags.join(" ")} ${item.notes}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesBrand = brandFilter === "All brands" || item.brand === brandFilter;
      const matchesSize = sizeFilter === "All sizes" || item.size === sizeFilter;
      const matchesWireless = !wirelessOnly || item.wireless;
      const matchesRapid = !rapidOnly || item.rapidTrigger;
      return matchesQuery && matchesBrand && matchesSize && matchesWireless && matchesRapid;
    });
  }, [query, brandFilter, sizeFilter, wirelessOnly, rapidOnly]);

  const selected = selectedIds.map((id) => keyboards.find((item) => item.id === id)).filter(Boolean) as Keyboard[];

  const toggleKeyboard = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((entry) => entry !== id);
      if (current.length >= maxCompare) return [...current.slice(1), id];
      return [...current, id];
    });
  };

  const featured = useMemo(() => {
    return {
      lowestLatency: [...filtered].sort((a, b) => a.latencyMs - b.latencyMs)[0],
      bestBattery: [...filtered].filter((item) => item.batteryHours !== null).sort((a, b) => (b.batteryHours ?? 0) - (a.batteryHours ?? 0))[0],
      bestValue: [...filtered].sort((a, b) => a.price - b.price)[0],
    };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-900 p-2 text-slate-200">
              <KeyboardIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.18em] text-slate-200">KEYBCOMPARE</div>
              <div className="text-xs text-slate-500">Keyboard database and comparison tool</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Badge className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-slate-300">{keyboards.length} models</Badge>
            <Badge className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-slate-300">{brands.length} brands</Badge>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <Card className="border-slate-800 bg-slate-900/60 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="max-w-4xl text-4xl leading-tight text-white md:text-6xl">
                Compare computer keyboards side by side.
              </CardTitle>
              <CardDescription className="max-w-3xl pt-2 text-base text-slate-400 md:text-lg">
                Search the catalog, filter by brand or size, and compare sound profile, battery life, latency, mounting, materials, and other deeper specs in one place.
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
              <CardTitle className="text-2xl text-white">Quick summary</CardTitle>
              <CardDescription className="text-slate-400">{compareSummary(selected)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3">
                  <div>
                    <div className="font-medium text-white">{item.brand} {item.model}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-slate-700 text-slate-300">{item.size}</Badge>
                      <Badge className={formatSwitchTone(item)}>{item.switchType}</Badge>
                      {item.wireless && <Badge className="border-emerald-400/20 bg-emerald-500/10 text-emerald-200">Wireless</Badge>}
                    </div>
                  </div>
                  <button onClick={() => toggleKeyboard(item.id)} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                  <div className="mb-1 text-xs uppercase tracking-[0.16em] text-slate-500">Fastest</div>
                  <div className="text-sm font-medium text-white">{featured.lowestLatency ? `${featured.lowestLatency.brand} ${featured.lowestLatency.model}` : "—"}</div>
                  <div className="text-sm text-slate-400">{featured.lowestLatency ? `${featured.lowestLatency.latencyMs} ms` : "—"}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                  <div className="mb-1 text-xs uppercase tracking-[0.16em] text-slate-500">Best battery</div>
                  <div className="text-sm font-medium text-white">{featured.bestBattery ? `${featured.bestBattery.brand} ${featured.bestBattery.model}` : "—"}</div>
                  <div className="text-sm text-slate-400">{featured.bestBattery ? `${featured.bestBattery.batteryHours} hrs` : "Wired only"}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                  <div className="mb-1 text-xs uppercase tracking-[0.16em] text-slate-500">Best value</div>
                  <div className="text-sm font-medium text-white">{featured.bestValue ? `${featured.bestValue.brand} ${featured.bestValue.model}` : "—"}</div>
                  <div className="text-sm text-slate-400">{featured.bestValue ? `$${featured.bestValue.price}` : "—"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <Card className="h-fit border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Browse keyboards</CardTitle>
              <CardDescription className="text-slate-400">Search the catalog and add boards to the compare rail.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brand, model, switch, sound..." className="border-slate-800 bg-slate-950 pl-9 text-slate-100 placeholder:text-slate-500" />
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
              <div className="grid gap-2 sm:grid-cols-2">
                <Button type="button" variant={wirelessOnly ? "default" : "outline"} className="justify-start rounded-2xl border-slate-800" onClick={() => setWirelessOnly((value) => !value)}>
                  <Wifi className="mr-2 h-4 w-4" /> Wireless only
                </Button>
                <Button type="button" variant={rapidOnly ? "default" : "outline"} className="justify-start rounded-2xl border-slate-800" onClick={() => setRapidOnly((value) => !value)}>
                  <Gauge className="mr-2 h-4 w-4" /> Rapid trigger
                </Button>
              </div>
              <div className="max-h-[860px] space-y-3 overflow-auto pr-1">
                {filtered.map((item) => {
                  const active = selectedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleKeyboard(item.id)}
                      className={`w-full rounded-3xl border p-3 text-left transition ${
                        active
                          ? "border-slate-700 bg-slate-900 shadow-none"
                          : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <ProductImage item={item} src={item.image} alt={`${item.brand} ${item.model}`} ratio="aspect-[4/3]" />
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-white">{item.brand} {item.model}</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className="border-slate-700 text-slate-300">{item.size}</Badge>
                            <Badge className={formatSwitchTone(item)}>{item.switchType}</Badge>
                            {item.soundProfile && <Badge className="border-slate-700 bg-slate-800 text-slate-300">{item.soundProfile}</Badge>}
                          </div>
                        </div>
                        <div className="rounded-full border border-slate-800 p-2 text-slate-300">
                          {active ? <Check className="h-4 w-4 text-slate-100" /> : <span className="px-1 text-sm">+</span>}
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-400">
                        <div>Latency <span className="block text-sm text-slate-200">{item.latencyMs} ms</span></div>
                        <div>Battery <span className="block text-sm text-slate-200">{item.batteryHours === null ? "Wired" : `${item.batteryHours}h`}</span></div>
                        <div>Price <span className="block text-sm text-slate-200">${item.price}</span></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Selected keyboard gallery</CardTitle>
                <CardDescription className="text-slate-400">Normalized image panels, cleaner spacing, and a more understated product layout.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 xl:grid-cols-2">
                  {selected.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950">
                      <div className="p-5 pb-0">
                        <ProductImage item={item} src={item.topImage} alt={`${item.brand} ${item.model} top view`} ratio="aspect-[4/3]" />
                      </div>
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xl font-semibold text-white">{item.brand} {item.model}</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline" className="border-slate-700 text-slate-300">{item.size}</Badge>
                              <Badge className={formatSwitchTone(item)}>{item.switchType}</Badge>
                              {item.wireless && <Badge className="border-emerald-400/20 bg-emerald-500/10 text-emerald-200">Wireless</Badge>}
                              {item.rapidTrigger && <Badge className="border-violet-400/20 bg-violet-500/10 text-violet-200">Rapid trigger</Badge>}
                              {item.imageVerified && item.officialUrl && <Badge className="border-slate-700 bg-slate-800 text-slate-300">Official image</Badge>}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Street price</div>
                            <div className="text-2xl font-semibold text-white">${item.price}</div>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
                            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Sound</div>
                            <div className="mt-1 text-sm font-medium text-white">{item.soundProfile}</div>
                          </div>
                          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
                            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Battery</div>
                            <div className="mt-1 text-sm font-medium text-white">{item.batteryHours === null ? "Wired only" : `${item.batteryHours} hrs`}</div>
                          </div>
                          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
                            <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Latency</div>
                            <div className="mt-1 text-sm font-medium text-white">{item.latencyMs} ms</div>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <ProductImage item={item} src={item.sideImage} alt={`${item.brand} ${item.model} side view`} ratio="aspect-[4/3]" />
                          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                            <div className="mb-2 font-medium text-white">Why it stands out</div>
                            <p>{item.notes}</p>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Mount</div>
                                <div className="text-sm text-white">{item.mounting}</div>
                              </div>
                              <div>
                                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Weight</div>
                                <div className="text-sm text-white">{item.weightG} g</div>
                              </div>
                              <div>
                                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Software</div>
                                <div className="text-sm text-white">{item.software}</div>
                              </div>
                              <div>
                                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Actuation</div>
                                <div className="text-sm text-white">{item.actuationRangeMm}</div>
                              </div>
                            </div>
                            {item.officialUrl && (
                              <a href={item.officialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white">
                                View official product page <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {specGroups.map((group) => (
              <Card key={group.title} className="overflow-hidden border-slate-800 bg-slate-900/60">
                <CardHeader className="border-b border-slate-800 bg-slate-900/60">
                  <CardTitle className="text-2xl text-white">{group.title}</CardTitle>
                  <CardDescription className="text-slate-400">Side-by-side specs for the selected keyboards.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950">
                          <th className="w-48 px-4 py-4 text-left font-medium text-slate-500">Metric</th>
                          {selected.map((item) => (
                            <th key={item.id} className="min-w-[240px] px-4 py-4 text-left">
                              <div className="font-medium text-white">{item.brand} {item.model}</div>
                              <div className="mt-1 text-xs text-slate-500">{item.size} · {item.switchType}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.columns.map(([label, getter], index) => (
                          <tr key={label} className={index % 2 === 0 ? "bg-slate-900/40" : "bg-slate-950/60"}>
                            <td className="border-b border-slate-800 px-4 py-3 font-medium text-slate-300">{label}</td>
                            {selected.map((item) => (
                              <td key={`${item.id}-${label}`} className="border-b border-slate-800 px-4 py-3 text-slate-100">
                                {getter(item)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
