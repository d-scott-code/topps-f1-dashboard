import { products as allProducts } from "@/lib/data";
import type { Product } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    Released: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "Rumored Cancelled": "bg-red-500/10 text-red-400 border-red-400/20",
    "Pre-Order": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${variants[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function TrendBadge({ trend, roi }: { trend: string | null; roi: number | null }) {
  if (!trend || roi === null) return <span className="text-xs text-muted-foreground">—</span>;
  const isUp = trend === "up";
  const isDown = trend === "down";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${isUp ? "text-emerald-500" : isDown ? "text-red-400" : "text-muted-foreground"}`}>
      {isUp ? "↑" : isDown ? "↓" : "→"}
      {roi > 0 ? "+" : ""}{roi.toFixed(0)}%
    </span>
  );
}

function MobileProductCard({ p }: { p: Product }) {
  return (
    <Card>
      <CardContent className="py-3 px-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground leading-tight">{p.name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="text-[10px]">{p.productType}</Badge>
              <span className="text-[10px] text-muted-foreground">{p.format}</span>
              <StatusBadge status={p.status} />
            </div>
          </div>
          <TrendBadge trend={p.trending ?? null} roi={p.roi ?? null} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {p.msrp && <span>MSRP: ${p.msrp.toLocaleString()}</span>}
            {p.releaseDate && <span>{p.releaseDate}</span>}
          </div>
          {p.currentMarket && (
            <p className="text-sm font-bold tabular-nums">${p.currentMarket.toLocaleString()}</p>
          )}
        </div>
        {p.notes && <p className="text-[10px] text-muted-foreground/70 leading-relaxed line-clamp-2">{p.notes}</p>}
      </CardContent>
    </Card>
  );
}

export default function ProductCatalog() {
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const prods = allProducts;
  const years = [...new Set(prods.map(p => p.year))].sort((a, b) => b - a);
  const types = [...new Set(prods.map(p => p.productType))].sort();

  const filtered = prods
    .filter(p => !yearFilter || p.year === yearFilter)
    .filter(p => !typeFilter || p.productType === typeFilter)
    .sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-5">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-foreground">Product Catalog</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Complete Topps F1 product database</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        <button
          data-testid="filter-all-years"
          onClick={() => setYearFilter(null)}
          className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[11px] md:text-xs font-medium rounded-full border transition-colors ${!yearFilter ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"}`}
        >
          All Years
        </button>
        {years.map(year => (
          <button
            key={year}
            data-testid={`filter-year-${year}`}
            onClick={() => setYearFilter(yearFilter === year ? null : year)}
            className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[11px] md:text-xs font-medium rounded-full border transition-colors ${yearFilter === year ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"}`}
          >
            {year}
          </button>
        ))}
        <div className="w-px bg-border mx-0.5 md:mx-1 hidden sm:block" />
        <button
          data-testid="filter-all-types"
          onClick={() => setTypeFilter(null)}
          className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[11px] md:text-xs font-medium rounded-full border transition-colors ${!typeFilter ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"}`}
        >
          All Types
        </button>
        {types.map(type => (
          <button
            key={type}
            data-testid={`filter-type-${type}`}
            onClick={() => setTypeFilter(typeFilter === type ? null : type)}
            className={`px-2.5 py-1 md:px-3 md:py-1.5 text-[11px] md:text-xs font-medium rounded-full border transition-colors ${typeFilter === type ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"}`}
          >
            {type}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} products</p>

      {/* Mobile: card list */}
      {isMobile ? (
        <div className="space-y-2">
          {filtered.map(p => (
            <MobileProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        /* Desktop: table */
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Year</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Format</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Release</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">MSRP</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Market</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">ROI</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        {p.notes && <p className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">{p.notes}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{p.year}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">{p.productType}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.format}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{p.releaseDate || "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{p.msrp ? `$${p.msrp.toLocaleString()}` : "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">
                      {p.currentMarket ? `$${p.currentMarket.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <TrendBadge trend={p.trending ?? null} roi={p.roi ?? null} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
