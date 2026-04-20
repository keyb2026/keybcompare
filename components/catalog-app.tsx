"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { brands, keyboards, sizes, type Keyboard } from "@/data/keyboards";
import { Check, Keyboard as KeyboardIcon, Search, Star, X } from "lucide-react";

const maxCompare = 4;

function summary(selected: Keyboard[]) {
  if (selected.length === 0) return "Search the catalog and start selecting keyboards to compare.";
  if (selected.length === 1) return `${selected[0].brand} ${selected[0].model} is ready to compare. Add up to three more keyboards.`;
  const cheapest = [...selected].sort((a, b) => a.price - b.price)[0];
  const wireless = selected.filter((item) => item.wireless).length;
  const hall = selected.filter((item) => /hall|magnetic|analog/i.test(item.switchType)).length;
  return `${cheapest.brand} ${cheapest.model} is the cheapest selected board at $${cheapest.price}. ${wireless} of ${selected.length} selected keyboards are wireless, and ${hall} use Hall Effect, magnetic, or analog-style switches.`;
}

function cellValue(item: Keyboard, key: string) {
  switch (key) {
    case "connection":
      return item.connection.join(", ");
    case "wireless":
    case "hotSwap":
      return item[key] ? "Yes" : "No";
    case "price":
      return `$${item.price}`;
    default:
      return String(item[key as keyof Keyboard] ?? "—");
  }
}

const columns = [
  ["Brand", "brand"],
  ["Model", "model"],
  ["Size", "size"],
  ["Switch type", "switchType"],
  ["Connection", "connection"],
  ["Wireless", "wireless"],
  ["Hot-swap", "hotSwap"],
  ["Layout", "layout"],
  ["Price", "price"],
  ["Notes", "notes"],
] as const;

export function CatalogApp() {
  const [query, setQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("All brands");
  const [sizeFilter, setSizeFilter] = useState("All sizes");
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "wooting-80he",
    "keychron-q1-max",
    "razer-huntsman-v3-pro-tkl",
  ]);

  const filtered = useMemo(() => {
    return keyboards.filter((item) => {
      const haystack = `${item.brand} ${item.model} ${item.size} ${item.switchType} ${item.tags.join(" ")}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesBrand = brandFilter === "All brands" || item.brand === brandFilter;
      const matchesSize = sizeFilter === "All sizes" || item.size === sizeFilter;
      return matchesQuery && matchesBrand && matchesSize;
    });
  }, [query, brandFilter, sizeFilter]);

  const selected = selectedIds.map((id) => keyboards.find((item) => item.id === id)).filter(Boolean) as Keyboard[];

  const toggleKeyboard = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((entry) => entry !== id);
      if (current.length >= maxCompare) return [...current.slice(1), id];
      return [...current, id];
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950">
            <CardHeader>
              <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
                <KeyboardIcon className="h-3.5 w-3.5" />
                Built with Next.js + Tailwind + shadcn-style UI
              </div>
              <CardTitle className="text-3xl md:text-5xl">Compare computer keyboards side by side</CardTitle>
              <CardDescription className="max-w-3xl text-base">
                A catalog-driven keyboard comparison site with images, brand filters, and side-by-side specs. Upload this project to GitHub and deploy straight to Vercel.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {[
                ["Catalog ready", `${keyboards.length} starter models across ${brands.length} brands`],
                ["Image ready", "Every model supports image, top image, and side image fields"],
                ["Scale ready", "Add more keyboards in one data file without rewriting the UI"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-border bg-black/20 p-4">
                  <div className="mb-1 font-medium">{title}</div>
                  <div className="text-sm text-muted-foreground">{text}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Star className="h-5 w-5 text-primary" /> Quick summary
              </CardTitle>
              <CardDescription>{summary(selected)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selected.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border bg-secondary p-3">
                  <div>
                    <div className="font-medium">{item.brand} {item.model}</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="outline">{item.size}</Badge>
                      <Badge>{item.switchType}</Badge>
                    </div>
                  </div>
                  <button onClick={() => toggleKeyboard(item.id)} className="rounded-full p-2 hover:bg-background">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="text-sm text-muted-foreground">Compare up to {maxCompare} keyboards at once.</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Browse keyboards</CardTitle>
              <CardDescription>Search the catalog and filter by brand or size.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search brand, model, size, switch..." className="pl-9" />
              </div>
              <div className="grid gap-3">
                <label className="grid gap-2 text-sm">
                  <span className="text-muted-foreground">Brand</span>
                  <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="h-10 rounded-xl border border-border bg-background px-3">
                    <option>All brands</option>
                    {brands.map((brand) => <option key={brand}>{brand}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className="h-10 rounded-xl border border-border bg-background px-3">
                    <option>All sizes</option>
                    {sizes.map((size) => <option key={size}>{size}</option>)}
                  </select>
                </label>
              </div>
              <div className="max-h-[720px] space-y-3 overflow-auto pr-1">
                {filtered.map((item) => {
                  const active = selectedIds.includes(item.id);
                  return (
                    <button key={item.id} onClick={() => toggleKeyboard(item.id)} className="w-full rounded-2xl border border-border bg-secondary p-3 text-left hover:border-primary/60">
                      <div className="mb-3 overflow-hidden rounded-xl border border-border bg-black/20">
                        <img src={item.image} alt={`${item.brand} ${item.model}`} className="aspect-[16/10] w-full object-cover" />
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{item.brand} {item.model}</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline">{item.size}</Badge>
                            <Badge>{item.switchType}</Badge>
                            {item.wireless && <Badge variant="secondary">Wireless</Badge>}
                            {item.hotSwap && <Badge variant="secondary">Hot-swap</Badge>}
                          </div>
                        </div>
                        <div className="rounded-full border border-border p-2">
                          {active ? <Check className="h-4 w-4 text-primary" /> : <span className="text-sm">+</span>}
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">{item.notes}</div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selected keyboard gallery</CardTitle>
                <CardDescription>Image-ready cards for the compare flow.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {selected.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-border bg-secondary p-3">
                      <img src={item.image} alt={`${item.brand} ${item.model}`} className="mb-3 aspect-[16/10] w-full rounded-xl border border-border object-cover" />
                      <div className="font-medium">{item.brand} {item.model}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline">{item.size}</Badge>
                        <Badge>{item.switchType}</Badge>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">{item.notes}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Side-by-side specs</CardTitle>
                <CardDescription>This table updates instantly as you select keyboards.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-3 py-3 text-left font-medium text-muted-foreground">Metric</th>
                      {selected.map((item) => (
                        <th key={item.id} className="min-w-[220px] px-3 py-3 text-left font-medium">
                          {item.brand} {item.model}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {columns.map(([label, key]) => (
                      <tr key={key} className="border-b border-border align-top">
                        <td className="px-3 py-3 font-medium text-muted-foreground">{label}</td>
                        {selected.map((item) => (
                          <td key={`${item.id}-${key}`} className="px-3 py-3">{cellValue(item, key)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to expand the catalog</CardTitle>
                <CardDescription>Add more keyboards without touching the UI layout.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Open <code className="rounded bg-secondary px-1.5 py-1 text-foreground">data/keyboards.ts</code> and add another entry to the brand array.</p>
                <p>Each keyboard supports image, topImage, and sideImage fields, so you can replace the generated placeholders with real product images later.</p>
                <p>Push changes to GitHub and Vercel will auto-redeploy the live site.</p>
                <Button variant="outline">Ready for GitHub + Vercel</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
