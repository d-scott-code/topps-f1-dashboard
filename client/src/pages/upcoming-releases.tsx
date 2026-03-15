import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Release {
  name: string;
  expectedDate: string;
  status: "Released" | "Pre-Order" | "Announced" | "Rumored" | "Rumored Cancelled" | "Active";
  estimatedPrice: string;
  notes: string;
  type: string;
}

const releases: Release[] = [
  {
    name: "2025 Topps Chrome F1",
    expectedDate: "Jan 22, 2026",
    status: "Released",
    estimatedPrice: "$249.99 MSRP → $375 market",
    notes: "75th Anniversary edition. Biggest rookie class ever. Grail chase (1:5,951 packs). F175 Refractor /75.",
    type: "Chrome",
  },
  {
    name: "2025 Topps Chrome LogoFractor F1",
    expectedDate: "Jan 29, 2026",
    status: "Released",
    estimatedPrice: "~$550 MSRP → $620 market",
    notes: "Second LogoFractor edition. Fanatics London exclusive initially. 6 packs per mega box.",
    type: "LogoFractor",
  },
  {
    name: "2025 Topps Chrome Sapphire F1",
    expectedDate: "Feb 12, 2026",
    status: "Released",
    estimatedPrice: "~$500 MSRP → $950 market",
    notes: "Premium Sapphire finish. Case: $4,499.99. Largest rookie lineup ever in Sapphire.",
    type: "Sapphire",
  },
  {
    name: "2025 Topps Dynasty F1",
    expectedDate: "Nov 19, 2025",
    status: "Released",
    estimatedPrice: "$1,199.99 MSRP → $1,300 market",
    notes: "Ultra-premium. 1 encased auto patch card /10 or less per box.",
    type: "Dynasty",
  },
  {
    name: "2025 Topps Lights Out F1",
    expectedDate: "Aug 2025",
    status: "Released",
    estimatedPrice: "~£425 MSRP → ~£800 market",
    notes: "UK Fanatics exclusive. 4 cards, 2 guaranteed autos. Sold out immediately. Massive secondary premium.",
    type: "Lights Out",
  },
  {
    name: "Topps Now F1 (Ongoing)",
    expectedDate: "Per race weekend",
    status: "Active",
    estimatedPrice: "$10-$25 per card",
    notes: "Available on Topps website after each race. Limited window (~1 week). Miss it and wait for next season.",
    type: "Topps Now",
  },
  {
    name: "2025 Topps Finest F1",
    expectedDate: "TBD (was expected ~April)",
    status: "Rumored Cancelled",
    estimatedPrice: "~$250 expected",
    notes: "Multiple sources report no 2025 Finest. Unconfirmed. Was a fan-favorite product. Pre-orders were at $250 on DACW.",
    type: "Finest",
  },
  {
    name: "2025 Topps Paddock Pass F1",
    expectedDate: "TBD",
    status: "Rumored Cancelled",
    estimatedPrice: "~$350 expected",
    notes: "Rumored cancelled for 2025. Would have been priced around $349.95 like 2024 edition.",
    type: "Paddock Pass",
  },
  {
    name: "2026 Topps Chrome F1",
    expectedDate: "Late 2026 / Early 2027",
    status: "Announced",
    estimatedPrice: "TBD",
    notes: "Next season's Chrome. Expect announcements after 2026 F1 season. Historically November-January release window.",
    type: "Chrome",
  },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  Released: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  "Pre-Order": { bg: "bg-blue-500/10", text: "text-blue-400" },
  Announced: { bg: "bg-sky-500/10", text: "text-sky-400" },
  Rumored: { bg: "bg-amber-500/10", text: "text-amber-500" },
  "Rumored Cancelled": { bg: "bg-red-500/10", text: "text-red-400" },
  Active: { bg: "bg-violet-500/10", text: "text-violet-400" },
};

export default function UpcomingReleases() {
  const calendarPattern = [
    { month: "Jul-Aug", products: "Turbo Attax, Lights Out (UK)", tier: "Entry / Mid" },
    { month: "Oct-Nov", products: "Dynasty", tier: "Ultra Premium" },
    { month: "Nov-Jan", products: "Chrome Hobby, Chrome Blaster", tier: "Flagship" },
    { month: "Jan-Feb", products: "LogoFractor, Sapphire", tier: "Premium" },
    { month: "Spring", products: "Finest (if not cancelled)", tier: "Mid-Premium" },
    { month: "Before Xmas", products: "Paddock Pass (if not cancelled)", tier: "Mid-Premium" },
    { month: "Ongoing", products: "Topps Now (per race)", tier: "Digital/Print-on-Demand" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-foreground">Upcoming Releases</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">Release calendar and launch tracker for Topps F1 products</p>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {releases.map((r, i) => {
          const sc = statusConfig[r.status] || statusConfig.Announced;
          return (
            <Card key={i} className="relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${r.status === "Released" ? "bg-emerald-500" : r.status === "Rumored Cancelled" ? "bg-red-400" : r.status === "Active" ? "bg-violet-400" : "bg-sky-400"}`} />
              <CardContent className="py-4 px-5 pl-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{r.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full ${sc.bg} ${sc.text}`}>
                        {r.status}
                      </span>
                      <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{r.notes}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-foreground">{r.expectedDate}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">{r.estimatedPrice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Typical Annual Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Typical Annual Release Pattern</CardTitle>
          <p className="text-xs text-muted-foreground">Based on historical Topps F1 release cadence</p>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase">Window</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase">Products</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs uppercase">Tier</th>
                </tr>
              </thead>
              <tbody>
                {calendarPattern.map((cp, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 font-medium text-xs">{cp.month}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{cp.products}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline" className="text-[10px]">{cp.tier}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Notes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Release Intel</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>Topps is notoriously inconsistent with release dates. Best bet is to watch larger breakers/resellers for advance info.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>Presale on Topps direct is typically the cheapest entry point. 2025 Chrome was $239.99 presale vs $249.99 release day vs $375+ secondary.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>2025 Chrome F1 has the 75th Anniversary Grail Program — 9-card chase with prizes. Cards registered on a live leaderboard.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>Lewis Hamilton's first Ferrari cards are in 2025 Chrome — On-Card Chrome Autograph exclusive to Hobby.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>Key rookies to watch: Gabriel Bortoleto (Kick Sauber), Isack Hadjar (VCARB), Oliver Bearman, Kimi Antonelli, Liam Lawson.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
