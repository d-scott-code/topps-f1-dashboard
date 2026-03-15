import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface SingleListing {
  card: string;
  grade: string;
  numbered: string;
  price: number;
  priceNote: string;
  status: "Available" | "Sold" | "Sale";
  source: string;
}

const dynastySingles: SingleListing[] = [
  { card: "Lando Norris / Carlos Sainz Dual Relic Auto", grade: "PSA 9", numbered: "/10", price: 13900, priceNote: "$13,900", status: "Sold", source: "Authentics.gg" },
  { card: "Max Verstappen / Alexander Albon Dual Relic Auto", grade: "PSA 10", numbered: "/10", price: 17900, priceNote: "Was $23,900 → $17,900", status: "Sale", source: "Authentics.gg" },
  { card: "Charles Leclerc Auto Patch (Silver)", grade: "PSA 9", numbered: "/10", price: 11900, priceNote: "Was $14,900 → $11,900", status: "Sale", source: "Authentics.gg" },
  { card: "Lando Norris Single-Driver Dual Relic Auto", grade: "PSA 9", numbered: "/10", price: 19900, priceNote: "$19,900", status: "Available", source: "Authentics.gg" },
  { card: "Lando Norris Triple Relic Auto", grade: "Raw", numbered: "/10", price: 3900, priceNote: "$3,490-$3,900", status: "Available", source: "Authentics.gg" },
  { card: "Valtteri Bottas Auto Suit Nameplate Relic", grade: "PSA 10", numbered: "/4", price: 4900, priceNote: "Was $5,900 → $4,900", status: "Sale", source: "Authentics.gg" },
  { card: "Lando Norris Triple Relic Auto", grade: "PSA 9", numbered: "/10", price: 3490, priceNote: "Was $3,690 → $3,490", status: "Sale", source: "Authentics.gg" },
  { card: "Nicholas Latifi Auto Patch", grade: "PSA 10 POP1", numbered: "/5", price: 3900, priceNote: "Was $4,490 → $3,900", status: "Sale", source: "Authentics.gg" },
  { card: "Kevin Magnussen Auto Racing Glove Relic", grade: "Raw", numbered: "/10", price: 1699, priceNote: "$1,699", status: "Sold", source: "Authentics.gg" },
  { card: "Toto Wolff Triple Relic Auto", grade: "Raw", numbered: "/10", price: 1299, priceNote: "$1,299", status: "Sold", source: "Authentics.gg" },
  { card: "Toto Wolff Triple Relic Auto", grade: "PSA 8", numbered: "/10", price: 999, priceNote: "$999", status: "Sold", source: "Authentics.gg" },
  { card: "Valtteri Bottas Triple Relic Auto", grade: "Raw", numbered: "/10", price: 1499, priceNote: "$1,499", status: "Sold", source: "Authentics.gg" },
  { card: "Romain Grosjean Auto Racing Glove Relic", grade: "Raw", numbered: "/10", price: 1499, priceNote: "$1,499", status: "Sold", source: "Authentics.gg" },
];

const sealedProducts = [
  {
    product: "2020 Topps Chrome F1 Hobby Box",
    msrp: 150,
    data: [
      { date: "Apr 2021", price: 150, label: "Release" },
      { date: "2022", price: 450, label: "" },
      { date: "2023", price: 900, label: "" },
      { date: "Early 2024", price: 1200, label: "" },
      { date: "Mar 2025", price: 1750, label: "" },
      { date: "Mar 2026", price: 2090, label: "Last sold" },
    ],
    current: 2090,
    roi: 1293,
    notes: "First ever Topps Chrome F1 product. Last sold $2,089.98 on Mar 2, 2026. Was $1,750 a year prior (+19.4% YoY). 18 packs, 4 cards/pack. RC class: Hamilton, Verstappen, Norris, Leclerc, Tsunoda, Mazepin, Schumacher.",
  },
  {
    product: "2020 Topps Chrome Sapphire F1 Hobby Box",
    msrp: 300,
    data: [
      { date: "2021", price: 300, label: "Release" },
      { date: "Jul 2023", price: 2025, label: "" },
      { date: "Oct 2023", price: 2500, label: "" },
      { date: "Sep 2025", price: 3100, label: "" },
      { date: "Oct 2025", price: 3300, label: "" },
      { date: "Jan 2026", price: 3900, label: "Recent high" },
    ],
    current: 3300,
    roi: 1000,
    notes: "Grail sealed product. Recent eBay sales: $3,050-$3,700 range. Extremely limited. Was $2,000-$2,700 in mid-2023. Steady appreciation. 8 packs, 4 cards/pack.",
  },
  {
    product: "2020 Topps Dynasty F1 Hobby Box",
    msrp: 800,
    data: [
      { date: "2021", price: 800, label: "Release" },
      { date: "2022", price: 1500, label: "" },
      { date: "2023", price: 2500, label: "" },
      { date: "2024", price: 3000, label: "" },
      { date: "2025", price: 3500, label: "" },
    ],
    current: 3500,
    roi: 338,
    notes: "Ultra-premium first-year Dynasty. 100-card base /10. On-card autos + patches. Singles from $999 (Wolff) to $19,900 (Norris PSA 9).",
  },
];

export default function VintageFinds() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">2020 Vintage Finds</h1>
        <p className="text-sm text-muted-foreground mt-1">First-year Topps F1 products — Hobby, Sapphire & Dynasty deep dive</p>
      </div>

      {/* Sealed Product Charts */}
      {sealedProducts.map((sp, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-sm font-semibold">{sp.product}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">MSRP: ${sp.msrp} → Current: ${sp.current.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
                  +{sp.roi}% ROI
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sp.data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Price"]}
                />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">{sp.notes}</p>
          </CardContent>
        </Card>
      ))}

      {/* Dynasty Singles Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">2020 Dynasty F1 — Notable Singles</CardTitle>
          <p className="text-xs text-muted-foreground">Recent listings and sales from Authentics.gg and secondary market</p>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase">Card</th>
                    <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase">Grade</th>
                    <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase">#</th>
                    <th className="text-right px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase">Price</th>
                    <th className="text-left px-3 py-2.5 font-medium text-muted-foreground text-xs uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dynastySingles.map((s, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 text-xs font-medium">{s.card}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{s.grade}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{s.numbered}</td>
                      <td className="px-3 py-2 text-right text-xs font-semibold tabular-nums">{s.priceNote}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                          s.status === "Available" ? "bg-blue-500/10 text-blue-400 border-blue-400/20" :
                          s.status === "Sale" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          "bg-muted text-muted-foreground border-border"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buying Tips */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">2020 Buying Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>2020 Chrome Hobby boxes have shown steady 20%+ YoY appreciation. Current $2,090 level. Any dip below $1,800 is a strong buy signal.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>2020 Sapphire is the grail sealed product — $3,000+ and climbing. Very few available. Under $3,000 is a deal (hasn't been seen since Sept 2025).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-0.5">•</span>
              <span>Dynasty singles with PSA 9-10 grades of star drivers (Norris, Leclerc, Verstappen) command massive premiums. Authentics.gg is a key dealer.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>Watch for Dynasty singles of mid-tier drivers at discounts — Magnussen glove relics ($1,699), Wolff triple relics ($999-$1,299) could be undervalued.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>Facebook groups and eBay auctions (vs Buy It Now) are where deals happen. The 2020 Chrome hobby someone was hunting on Facebook recently.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
