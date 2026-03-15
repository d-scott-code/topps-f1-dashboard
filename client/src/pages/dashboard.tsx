import { products as allProducts } from "@/lib/data";
import type { Product } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Cell
} from "recharts";
import {
  getHotDeals,
  getBelowMsrpDeals,
  findBestDeal,
  type Deal,
  getPctVsMsrp,
} from "@/lib/deals-data";

function KPICard({ title, value, subtitle, trend, color }: {
  title: string; value: string; subtitle: string; trend?: string; color?: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-5 pb-4 px-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold mt-1 tabular-nums" style={color ? { color } : {}}>{value}</p>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span className={`text-xs font-medium ${trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-400" : "text-muted-foreground"}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {subtitle}
            </span>
          )}
          {!trend && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function DealBadge({ deal }: { deal: Deal }) {
  const pct = getPctVsMsrp(deal);
  if (pct !== null && pct <= 0) {
    return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">{pct}% MSRP</Badge>;
  }
  if (deal.availability === "in_stock") {
    return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">In Stock</Badge>;
  }
  return null;
}

export default function Dashboard() {
  const prods = allProducts;
  const released2025 = prods.filter(p => p.year === 2025 && p.status === "Released");
  const avgROI = released2025.filter(p => p.roi !== null).reduce((sum, p) => sum + (p.roi || 0), 0) / Math.max(released2025.filter(p => p.roi !== null).length, 1);
  const topPerformer = prods.filter(p => p.roi !== null).sort((a, b) => (b.roi || 0) - (a.roi || 0))[0];

  // Chart data: Market price by year for Chrome Hobby boxes
  const chromeByYear = prods
    .filter(p => p.productType === "Chrome" && p.format === "Hobby Box")
    .sort((a, b) => a.year - b.year)
    .map(p => ({
      year: p.year.toString(),
      msrp: p.msrp || 0,
      market: p.currentMarket || 0,
    }));

  // ROI by product type
  const productTypes = [...new Set(prods.map(p => p.productType))];
  const roiByType = productTypes
    .map(type => {
      const typeProds = prods.filter(p => p.productType === type && p.roi !== null && p.roi !== 0);
      const avgRoi = typeProds.length > 0 
        ? typeProds.reduce((sum, p) => sum + (p.roi || 0), 0) / typeProds.length 
        : 0;
      return { type: type === "Paddock Pass" ? "Paddock" : type, avgRoi: Math.round(avgRoi * 10) / 10, count: typeProds.length };
    })
    .filter(d => d.count > 0 && d.avgRoi !== 0)
    .sort((a, b) => b.avgRoi - a.avgRoi);

  // Trending products with linked deals
  const trendingUp = prods.filter(p => p.trending === "up" && p.year >= 2024).sort((a, b) => (b.roi || 0) - (a.roi || 0)).slice(0, 5);
  const belowMsrp = prods.filter(p => p.currentMarket && p.msrp && p.currentMarket < p.msrp).sort((a, b) => (a.roi || 0) - (b.roi || 0));

  // Top deals from deals data
  const hotDeals = getHotDeals().slice(0, 4);
  const belowMsrpDeals = getBelowMsrpDeals().slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Topps F1 Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Market overview and pricing intelligence</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="2025 Products Released"
          value={released2025.length.toString()}
          subtitle={`of ${prods.filter(p => p.year === 2025).length} total`}
          trend="up"
        />
        <KPICard
          title="Avg 2025 ROI"
          value={`${avgROI.toFixed(1)}%`}
          subtitle="vs MSRP"
          trend={avgROI > 0 ? "up" : "down"}
          color={avgROI > 0 ? "hsl(142, 71%, 45%)" : undefined}
        />
        <KPICard
          title="Top Performer (All Time)"
          value={topPerformer ? `${topPerformer.roi?.toFixed(0)}% ROI` : "-"}
          subtitle={topPerformer ? `${topPerformer.year} ${topPerformer.productType}` : ""}
          trend="up"
          color="hsl(142, 71%, 45%)"
        />
        <KPICard
          title="2020 Chrome Hobby"
          value="$2,090"
          subtitle="Last sold Mar 2, 2026"
          trend="up"
          color="hsl(142, 71%, 45%)"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chrome Hobby MSRP vs Market */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Chrome Hobby: MSRP vs Market Price</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chromeByYear} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="msrp" name="MSRP" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="market" name="Market Price" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ROI by Product Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Avg ROI by Product Line</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={roiByType} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" fontSize={12} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="type" fontSize={12} stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: number) => [`${value}%`, "Avg ROI"]}
                />
                <Bar dataKey="avgRoi" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                  {roiByType.map((entry, i) => (
                    <Cell key={i} fill={entry.avgRoi >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 72%, 51%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Deals Spotlight */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span className="text-emerald-500">🔥</span> Top Deals Right Now
            </CardTitle>
            <a href="#/deals" className="text-xs text-primary hover:underline">View all deals →</a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {hotDeals.map(deal => (
              <a
                key={deal.id}
                href={deal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
                data-testid={`deal-link-${deal.id}`}
              >
                <div className="border border-border rounded-lg p-3 space-y-1.5 hover:border-primary/40 hover:bg-muted/50 transition-colors h-full">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {deal.product}
                    </p>
                    <DealBadge deal={deal} />
                  </div>
                  <p className="text-lg font-bold tabular-nums text-emerald-500">
                    {deal.priceDisplay}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{deal.seller}</p>
                  <p className="text-[10px] text-muted-foreground/70 leading-relaxed line-clamp-2">{deal.notes}</p>
                  <div className="pt-1">
                    <span className="text-[10px] text-primary font-medium group-hover:underline">
                      View listing ↗
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trending Up - with links */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span className="text-emerald-500">↑</span> Trending Up (2024-2025)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingUp.map(p => {
                const bestDeal = findBestDeal(p.year, p.productType);
                return (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.format} · {p.year}</p>
                      {bestDeal && (
                        <a
                          href={bestDeal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-[10px] text-primary hover:underline"
                          data-testid={`trending-deal-${p.id}`}
                        >
                          Best price: {bestDeal.priceDisplay} at {bestDeal.seller} ↗
                        </a>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-semibold tabular-nums">${p.currentMarket?.toLocaleString()}</p>
                      <Badge variant="secondary" className="text-emerald-500 text-xs">
                        +{p.roi?.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Below MSRP Deals - with links */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span className="text-amber-500">$</span> Below MSRP Opportunities
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {belowMsrp.length === 0 && belowMsrpDeals.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No products currently below MSRP</p>
              )}
              {/* Show product-level below MSRP with deal links */}
              {belowMsrp.map(p => {
                const bestDeal = findBestDeal(p.year, p.productType);
                return (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.format} · MSRP: ${p.msrp?.toLocaleString()}</p>
                      {bestDeal && (
                        <a
                          href={bestDeal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-[10px] text-primary hover:underline"
                          data-testid={`below-msrp-deal-${p.id}`}
                        >
                          Buy at {bestDeal.priceDisplay} from {bestDeal.seller} ↗
                        </a>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-semibold tabular-nums">${p.currentMarket?.toLocaleString()}</p>
                      <Badge variant="secondary" className="text-red-400 text-xs">
                        {p.roi?.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {/* Also show deal-sourced below-MSRP items not already in products list */}
              {belowMsrpDeals
                .filter(d => !belowMsrp.some(p => p.year === d.year && d.product.toLowerCase().includes(p.productType.toLowerCase())))
                .slice(0, 3)
                .map(d => (
                  <a
                    key={d.id}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-2 border-b border-border last:border-0 group hover:bg-muted/30 -mx-2 px-2 rounded"
                    data-testid={`msrp-deal-${d.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{d.product}</p>
                      <p className="text-xs text-muted-foreground">{d.seller}</p>
                      <span className="text-[10px] text-primary">View listing ↗</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-semibold tabular-nums text-emerald-500">{d.priceDisplay}</p>
                      {d.msrp && (
                        <span className="text-[10px] text-muted-foreground">MSRP ${d.msrp.toLocaleString()}</span>
                      )}
                    </div>
                  </a>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
