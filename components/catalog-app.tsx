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
  MonitorSmartphone,
  Search,
  Sparkles,
  Star,
  Volume2,
  Wifi,
  X,
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
  const longestBattery = [...selected].filter((item) => item.batteryHours !== null).sort((a, b) => (b.batteryHours ?? 0) - (a.batteryHours ?? 0))[0];
  const heCount = selected.filter((item) => item.rapidTrigger).length;
  return `${cheapest.brand} ${cheapest.model} is the lowest-priced pick at $${cheapest.price}. ${fastest.brand} ${fastest.model} is the quickest on paper at ${fastest.latencyMs} ms. ${longestBattery ? `${longestBattery.brand} ${longestBattery.model} leads battery life at ${longestBattery.batteryHours} hours.` : "These are all wired-first boards."} ${heCount} of ${selected.length} selected keyboards support gaming-focused adjustable actuation or rapid trigger behavior.`;
}

function formatSwitchTone(item: Keyboard) {
  if (/hall|magnetic|analog/i.test(item.switchType)) return "bg-violet-500/15 text-violet-200 border-violet-500/30";
  if (/low-profile/i.test(item.switchType)) return "bg-cyan-500/15 text-cyan-200 border-cyan-500/30";
  if (/membrane/i.test(item.switchType)) return "bg-amber-500/15 text-amber-200 border-amber-500/30";
  return "bg-blue-500/15 text-blue-200 border-blue-500/30";
}

function metricCard(label: string, value: string, icon: ReactNode) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">{icon}{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
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
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_36%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_32%),linear-gradient(180deg,#020617_0%,#020617_55%,#020617_100%)]" />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/20 p-2 text-blue-200">
              <KeyboardIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.22em] text-slate-300">KEYBCOMPARE</div>
              <div className="text-xs text-slate-400">Premium keyboard finder and side-by-side spec explorer</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-slate-200">{keyboards.length} models</Badge>
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-slate-200">{brands.length} brands</Badge>
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-slate-200">Sound + battery specs</Badge>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden border-white/10 bg-white/5 shadow-2xl shadow-blue-950/25 backdrop-blur-md">
            <CardHeader className="pb-4">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200"><Sparkles className="mr-1 h-3.5 w-3.5" /> Polished Version 3</Badge>
                <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">Next.js + shadcn-style UI</Badge>
                <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">GitHub + Vercel ready</Badge>
              </div>
              <CardTitle className="max-w-4xl text-4xl leading-tight text-white md:text-6xl">
                Compare computer keyboards with deeper specs, cleaner visuals, and a site that feels real.
              </CardTitle>
              <CardDescription className="max-w-3xl pt-2 text-base text-slate-300 md:text-lg">
                Browse a starter catalog across major brands, then compare sound profile, battery life, latency, mounting, materials, weight, and more. This version is built to scale without rewriting the UI every time you add more boards.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {metricCard("Catalog", `${keyboards.length} starter models`, <Layers3 className="h-3.5 w-3.5" />)}
              {metricCard("Battery aware", "Wireless hours included", <BatteryCharging className="h-3.5 w-3.5" />)}
              {metricCard("Sound aware", "Sound profile + build depth", <Volume2 className="h-3.5 w-3.5" />)}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-white">
                <Star className="h-5 w-5 text-blue-300" /> Quick summary
              </CardTitle>
              <CardDescription className="text-slate-300">{compareSummary(selected)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <div className="font-medium text-white">{item.brand} {item.model}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-white/10 text-slate-200">{item.size}</Badge>
                      <Badge className={formatSwitchTone(item)}>{item.switchType}</Badge>
                      {item.wireless && <Badge className="border-emerald-400/20 bg-emerald-500/15 text-emerald-200">Wireless</Badge>}
                    </div>
                  </div>
                  <button onClick={() => toggleKeyboard(item.id)} className="rounded-full p-2 text-slate-400 transition hover:bg-white/5 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500">Fastest</div>
                  <div className="text-sm font-medium text-white">{featured.lowestLatency ? `${featured.lowestLatency.brand} ${featured.lowestLatency.model}` : "—"}</div>
                  <div className="text-sm text-slate-400">{featured.lowestLatency ? `${featured.lowestLatency.latencyMs} ms` : "—"}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500">Best battery</div>
                  <div className="text-sm font-medium text-white">{featured.bestBattery ? `${featured.bestBattery.brand} ${featured.bestBattery.model}` : "—"}</div>
                  <div className="text-sm text-slate-400">{featured.bestBattery ? `${featured.bestBattery.batteryHours} hrs` : "Wired only"}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500">Best value</div>
                  <div className="text-sm font-medium text-white">{featured.bestValue ? `${featured.bestValue.brand} ${featured.bestValue.model}` : "—"}</div>
                  <div className="text-sm text-slate-400">{featured.bestValue ? `$${featured.bestValue.price}` : "—"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card className="h-fit border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Browse keyboards</CardTitle>
              <CardDescription className="text-slate-300">Use filters for brand, size, wireless, and rapid trigger, then add boards to the compare rail.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brand, model, switch, sound..." className="border-white/10 bg-slate-950/70 pl-9 text-slate-100 placeholder:text-slate-500" />
              </div>
              <div className="grid gap-3">
                <label className="grid gap-2 text-sm">
                  <span className="text-slate-400">Brand</span>
                  <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="h-11 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-slate-100 outline-none">
                    <option>All brands</option>
                    {brands.map((brand) => <option key={brand}>{brand}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-slate-400">Size</span>
                  <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className="h-11 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-slate-100 outline-none">
                    <option>All sizes</option>
                    {sizes.map((size) => <option key={size}>{size}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button type="button" variant={wirelessOnly ? "default" : "outline"} className="justify-start rounded-2xl border-white/10" onClick={() => setWirelessOnly((value) => !value)}>
                  <Wifi className="mr-2 h-4 w-4" /> Wireless only
                </Button>
                <Button type="button" variant={rapidOnly ? "default" : "outline"} className="justify-start rounded-2xl border-white/10" onClick={() => setRapidOnly((value) => !value)}>
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
                          ? "border-blue-400/30 bg-blue-500/10 shadow-lg shadow-blue-950/30"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
                        <img src={item.image} alt={`${item.brand} ${item.model}`} className="aspect-[16/10] w-full object-cover" />
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-white">{item.brand} {item.model}</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className="border-white/10 text-slate-200">{item.size}</Badge>
                            <Badge className={formatSwitchTone(item)}>{item.switchType}</Badge>
                            {item.soundProfile && <Badge className="border-white/10 bg-white/5 text-slate-200">{item.soundProfile}</Badge>}
                          </div>
                        </div>
                        <div className="rounded-full border border-white/10 p-2 text-slate-300">
                          {active ? <Check className="h-4 w-4 text-blue-300" /> : <span className="px-1 text-sm">+</span>}
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
            <Card className="border-white/10 bg-white/5 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Selected keyboard gallery</CardTitle>
                <CardDescription className="text-slate-300">Larger visual cards with richer specs, so the site feels closer to a real product database than a starter demo.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 xl:grid-cols-2">
                  {selected.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/65">
                      <img src={item.topImage} alt={`${item.brand} ${item.model} top view`} className="aspect-[16/10] w-full object-cover" />
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xl font-semibold text-white">{item.brand} {item.model}</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline" className="border-white/10 text-slate-200">{item.size}</Badge>
                              <Badge className={formatSwitchTone(item)}>{item.switchType}</Badge>
                              {item.wireless && <Badge className="border-emerald-400/20 bg-emerald-500/15 text-emerald-200">Wireless</Badge>}
                              {item.rapidTrigger && <Badge className="border-violet-400/20 bg-violet-500/15 text-violet-200">Rapid trigger</Badge>}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Street price</div>
                            <div className="text-2xl font-semibold text-white">${item.price}</div>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Sound</div>
                            <div className="mt-1 text-sm font-medium text-white">{item.soundProfile}</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Battery</div>
                            <div className="mt-1 text-sm font-medium text-white">{item.batteryHours === null ? "Wired only" : `${item.batteryHours} hrs`}</div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Latency</div>
                            <div className="mt-1 text-sm font-medium text-white">{item.latencyMs} ms</div>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <img src={item.sideImage} alt={`${item.brand} ${item.model} side view`} className="aspect-[16/9] rounded-2xl border border-white/10 object-cover" />
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                            <div className="mb-2 font-medium text-white">Why it stands out</div>
                            <p>{item.notes}</p>
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Mount</div>
                                <div className="text-sm text-white">{item.mounting}</div>
                              </div>
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Weight</div>
                                <div className="text-sm text-white">{item.weightG} g</div>
                              </div>
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Software</div>
                                <div className="text-sm text-white">{item.software}</div>
                              </div>
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Actuation</div>
                                <div className="text-sm text-white">{item.actuationRangeMm}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {specGroups.map((group) => (
              <Card key={group.title} className="overflow-hidden border-white/10 bg-white/5 backdrop-blur-md">
                <CardHeader className="border-b border-white/10 bg-white/[0.03]">
                  <CardTitle className="text-2xl text-white">{group.title}</CardTitle>
                  <CardDescription className="text-slate-300">Side-by-side specs for the selected keyboards.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-white/10 bg-slate-950/60">
                          <th className="w-48 px-4 py-4 text-left font-medium text-slate-400">Metric</th>
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
                          <tr key={label} className={index % 2 === 0 ? "bg-white/[0.02]" : "bg-slate-950/35"}>
                            <td className="border-b border-white/10 px-4 py-3 font-medium text-slate-300">{label}</td>
                            {selected.map((item) => (
                              <td key={`${item.id}-${label}`} className="border-b border-white/10 px-4 py-3 text-slate-100">
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

            <Card className="border-white/10 bg-white/5 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-white">What changed in this version</CardTitle>
                <CardDescription className="text-slate-300">A cleaner front end and deeper data structure so you can keep growing the site without redesigning it again.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 font-medium text-white"><Volume2 className="h-4 w-4 text-blue-300" /> More useful specs</div>
                  <p className="text-sm text-slate-300">Every catalog item now supports sound profile, battery life, latency, actuation, mounting, materials, weight, and software.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 font-medium text-white"><MonitorSmartphone className="h-4 w-4 text-blue-300" /> Better product feel</div>
                  <p className="text-sm text-slate-300">The gallery cards are larger, cleaner, and more premium so your site feels closer to a polished buyer tool than a placeholder grid.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2 font-medium text-white"><Layers3 className="h-4 w-4 text-blue-300" /> Easy to extend</div>
                  <p className="text-sm text-slate-300">Add more boards in <code className="rounded bg-white/10 px-1 py-0.5">data/keyboards.ts</code>. The UI updates automatically.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
