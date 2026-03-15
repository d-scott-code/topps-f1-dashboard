import { products as allProducts } from "@/lib/data";
import type { Product } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";

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

export default function Dashboard() {
  const prods = allProducts;
  const released2025 = prods.filter(p => p.year === 2025 && p.status === "Released");
  const totalMarketValue = released2025.reduce((sum, p) => sum + (p.currentMarket || 0), 0);
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

  // 2025 product breakdown pie chart
  const status2025 = [
    { name: "Released", value: prods.filter(p => p.year === 2025 && p.status === "Released").length, color: "hsl(var(--primary))" },
    { name: "Rumored Cancelled", value: prods.filter(p => p.year === 2025 && p.status === "Rumored Cancelled").length, color: "hsl(var(--destructive))" },
  ];

  // Trending products
  const trendingUp = prods.filter(p => p.trending === "up" && p.year >= 2024).sort((a, b) => (b.roi || 0) - (a.roi || 0)).slice(0, 5);
  const belowMsrp = prods.filter(p => p.currentMarket && p.msrp && p.currentMarket < p.msrp).sort((a, b) => (a.roi || 0) - (b.roi || 0));

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

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trending Up */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span className="text-emerald-500">↑</span> Trending Up (2024-2025)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingUp.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.format} · {p.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">${p.currentMarket?.toLocaleString()}</p>
                    <Badge variant="secondary" className="text-emerald-500 text-xs">
                      +{p.roi?.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Below MSRP Deals */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span className="text-amber-500">$</span> Below MSRP Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {belowMsrp.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No products currently below MSRP</p>
              )}
              {belowMsrp.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.format} · MSRP: ${p.msrp?.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">${p.currentMarket?.toLocaleString()}</p>
                    <Badge variant="secondary" className="text-red-400 text-xs">
                      {p.roi?.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
