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
      <CardContent className="pt-4 pb-3 px-4">
        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider leading-tight">{title}</p>
        <p className="text-lg sm:text-2xl font-bold mt-1 tabular-nums" style={color ? { color } : {}}>{value}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {trend && (
            <span className={`text-[10px] sm:text-xs font-medium ${trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-400" : "text-muted-foreground"}`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {subtitle}
            </span>
          )}
          {!trend && <span className="text-[10px] sm:text-xs text-muted-foreground">{subtitle}</span>}
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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-foreground">Topps F1 Dashboard</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Market overview and pricing intelligence</p>
      </div>

      {/* KPIs — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KPICard
          title="2025 Released"
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
          title="Top Performer"
          value={topPerformer ? `${topPerformer.roi?.toFixed(0)}%` : "-"}
          subtitle={topPerformer ? `${topPerformer.year} ${topPerformer.productType}` : ""}
          trend="up"
          color="hsl(142, 71%, 45%)"
        />
        <KPICard
          title="2020 Chrome"
          value="$2,090"
          subtitle="Last sold Mar 2"
          trend="up"
          color="hsl(142, 71%, 45%)"
        />
      </div>

      {/* Charts Row — stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {/* Chrome Hobby MSRP vs Market */}
        <Card>
          <CardHeader className="pb-2 px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-semibold">Chrome Hobby: MSRP vs Market</CardTitle>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chromeByYear} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v}`} width={50} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="msrp" name="MSRP" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="market" name="Market" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ROI by Product Type */}
        <Card>
          <CardHeader className="pb-2 px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-semibold">Avg ROI by Product Line</CardTitle>
          </CardHeader>
          <CardContent className="px-2 md:px-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={roiByType} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" fontSize={11} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="type" fontSize={11} stroke="hsl(var(--muted-foreground))" width={65} />
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
        <CardHeader className="pb-2 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs md:text-sm font-semibold flex items-center gap-2">
              <span className="text-emerald-500">🔥</span> Top Deals Right Now
            </CardTitle>
            <a href="#/deals" className="text-[10px] md:text-xs text-primary hover:underline">View all →</a>
          </div>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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
                  <p className="text-base md:text-lg font-bold tabular-nums text-emerald-500">
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

      {/* Bottom Section — stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {/* Trending Up */}
        <Card>
          <CardHeader className="pb-2 px-4 md:px-6">
            <CardTitle className="text-xs md:text-sm font-semibold flex items-center gap-2">
              <span className="text-emerald-500">↑</span> Trending Up (2024-2025)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="space-y-3">
              {trendingUp.map(p => {
                const bestDeal = findBestDeal(p.year, p.productType);
                return (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium truncate">{p.name}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{p.format} · {p.year}</p>
                      {bestDeal && (
                        <a
                          href={bestDeal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 text-[10px] text-primary hover:underline"
                          data-testid={`trending-deal-${p.id}`}
                        >
                          Best: {bestDeal.priceDisplay} at {bestDeal.seller} ↗
                        </a>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs md:text-sm font-semibold tabular-nums">${p.currentMarket?.toLocaleString()}</p>
                      <Badge variant="secondary" className="text-emerald-500 text-[10px]">
                        +{p.roi?.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Below MSRP Deals */}
        <Card>
          <CardHeader className="pb-2 px-4 md:px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm font-semibold flex items-center gap-2">
                <span className="text-amber-500">$</span> Below MSRP Opportunities
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="space-y-3">
              {belowMsrp.length === 0 && belowMsrpDeals.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No products currently below MSRP</p>
              )}
              {belowMsrp.map(p => {
                const bestDeal = findBestDeal(p.year, p.productType);
                return (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium truncate">{p.name}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{p.format} · MSRP: ${p.msrp?.toLocaleString()}</p>
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
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs md:text-sm font-semibold tabular-nums">${p.currentMarket?.toLocaleString()}</p>
                      <Badge variant="secondary" className="text-red-400 text-[10px]">
                        {p.roi?.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
              {/* Deal-sourced below-MSRP items */}
              {belowMsrpDeals
                .filter(d => !belowMsrp.some(p => p.year === d.year && d.product.toLowerCase().includes(p.productType.toLowerCase())))
                .slice(0, 3)
                .map(d => (
                  <a
                    key={d.id}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between py-2 border-b border-border last:border-0 group hover:bg-muted/30 -mx-2 px-2 rounded gap-3"
                    data-testid={`msrp-deal-${d.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium group-hover:text-primary transition-colors truncate">{d.product}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{d.seller}</p>
                      <span className="text-[10px] text-primary">View listing ↗</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs md:text-sm font-semibold tabular-nums text-emerald-500">{d.priceDisplay}</p>
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
