import { products as allProducts } from "@/lib/data";
import type { Product } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from "recharts";

export default function PriceTracker() {
  const prods = allProducts;

  // Chrome Hobby Box price evolution over years
  const chromeHobby = prods
    .filter(p => p.productType === "Chrome" && p.format === "Hobby Box")
    .sort((a, b) => a.year - b.year)
    .map(p => ({
      year: p.year.toString(),
      msrp: p.msrp || 0,
      market: p.currentMarket || 0,
      low: p.marketLow || 0,
      high: p.marketHigh || 0,
    }));

  // Sapphire price evolution
  const sapphireHobby = prods
    .filter(p => p.productType === "Sapphire" && p.format === "Hobby Box")
    .sort((a, b) => a.year - b.year)
    .map(p => ({
      year: p.year.toString(),
      msrp: p.msrp || 0,
      market: p.currentMarket || 0,
      low: p.marketLow || 0,
      high: p.marketHigh || 0,
    }));

  // Dynasty price evolution
  const dynasty = prods
    .filter(p => p.productType === "Dynasty" && p.format === "Hobby Box")
    .sort((a, b) => a.year - b.year)
    .map(p => ({
      year: p.year.toString(),
      msrp: p.msrp || 0,
      market: p.currentMarket || 0,
    }));

  // Price ranges for 2025 products
  const ranges2025 = prods
    .filter(p => p.year === 2025 && p.currentMarket && p.marketLow && p.marketHigh)
    .map(p => ({
      name: p.productType + (p.format !== "Hobby Box" ? ` (${p.format})` : ""),
      current: p.currentMarket || 0,
      low: p.marketLow || 0,
      high: p.marketHigh || 0,
      msrp: p.msrp || 0,
    }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Price Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">Market pricing trends across all Topps F1 product lines</p>
      </div>

      {/* Chrome Hobby Evolution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Chrome Hobby Box — Price History (2020-2025)</CardTitle>
          <p className="text-xs text-muted-foreground">MSRP vs current market value with high/low range</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chromeHobby} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" fontSize={12} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="high" name="High" stroke="none" fill="hsl(142, 71%, 45%)" fillOpacity={0.1} />
              <Area type="monotone" dataKey="low" name="Low" stroke="none" fill="hsl(142, 71%, 45%)" fillOpacity={0.05} />
              <Line type="monotone" dataKey="market" name="Current Market" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
              <Line type="monotone" dataKey="msrp" name="MSRP" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 3, fill: "hsl(var(--muted-foreground))" }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sapphire Evolution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Sapphire Hobby — Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sapphireHobby} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="market" name="Market" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 4, fill: "#a78bfa" }} />
                <Line type="monotone" dataKey="msrp" name="MSRP" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dynasty Evolution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Dynasty Hobby — Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dynasty} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={12} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="market" name="Market" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: "#f59e0b" }} />
                <Line type="monotone" dataKey="msrp" name="MSRP" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 2025 Product Price Ranges */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">2025 Product Price Ranges</CardTitle>
          <p className="text-xs text-muted-foreground">Current market, MSRP, and observed high/low</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ranges2025.map((p, i) => {
              const maxVal = Math.max(p.high, p.msrp) * 1.1;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="tabular-nums text-muted-foreground">
                      ${p.low.toLocaleString()} — ${p.high.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative h-6 bg-muted/50 rounded-full overflow-hidden">
                    {/* Range bar */}
                    <div
                      className="absolute h-full bg-primary/20 rounded-full"
                      style={{
                        left: `${(p.low / maxVal) * 100}%`,
                        width: `${((p.high - p.low) / maxVal) * 100}%`,
                      }}
                    />
                    {/* Current price marker */}
                    <div
                      className="absolute h-full w-1 bg-primary rounded-full"
                      style={{ left: `${(p.current / maxVal) * 100}%` }}
                      title={`Current: $${p.current.toLocaleString()}`}
                    />
                    {/* MSRP marker */}
                    <div
                      className="absolute h-full w-0.5 bg-muted-foreground/50"
                      style={{ left: `${(p.msrp / maxVal) * 100}%` }}
                      title={`MSRP: $${p.msrp.toLocaleString()}`}
                    />
                    {/* Current price label */}
                    <span
                      className="absolute top-0.5 text-[10px] font-semibold text-primary tabular-nums"
                      style={{ left: `${Math.min((p.current / maxVal) * 100 + 2, 85)}%` }}
                    >
                      ${p.current.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full" /> Current</span>
            <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-muted-foreground/50" /> MSRP</span>
            <span className="flex items-center gap-1"><span className="w-4 h-2 bg-primary/20 rounded" /> Range</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
