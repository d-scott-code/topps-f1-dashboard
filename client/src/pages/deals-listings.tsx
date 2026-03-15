import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type Deal,
  getHotDeals,
  getBelowMsrpDeals,
  getPremiumSingles,
  getInStockBoxes,
  getWatchList,
  getCaseDealsInStock,
  getCaseDealsWatchlist,
  getDynastyInStock,
  getDynastyWatchlist,
  getPctVsMsrp,
  retailerLinks,
} from "@/lib/deals-data";

function AvailabilityBadge({ deal }: { deal: Deal }) {
  switch (deal.availability) {
    case "in_stock":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
          In Stock
        </Badge>
      );
    case "auction":
      return (
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
          Auction
        </Badge>
      );
    case "sold_out":
      return (
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
          Sold Out
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-[10px] text-muted-foreground">
          Unknown
        </Badge>
      );
  }
}

function PriceColor({ deal }: { deal: Deal }) {
  const pct = getPctVsMsrp(deal);
  if (pct === null) return <span className="text-foreground">{deal.priceDisplay}</span>;
  if (pct <= 0) return <span className="text-emerald-500">{deal.priceDisplay}</span>;
  if (pct <= 50) return <span className="text-amber-500">{deal.priceDisplay}</span>;
  return <span className="text-red-400">{deal.priceDisplay}</span>;
}

function MsrpIndicator({ deal }: { deal: Deal }) {
  const pct = getPctVsMsrp(deal);
  if (pct === null || deal.msrp === null) return null;
  const label = pct <= 0 ? `${pct}% vs MSRP` : `+${pct}% vs MSRP`;
  const color = pct <= 0 ? "text-emerald-500" : pct <= 50 ? "text-amber-500" : "text-red-400";
  return (
    <span className={`text-[10px] ${color}`}>
      {label} (MSRP ${deal.msrp.toLocaleString()})
    </span>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <Card className="flex flex-col justify-between">
      <CardContent className="pt-4 pb-3 px-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground leading-tight">
            {deal.product}
          </h3>
          <AvailabilityBadge deal={deal} />
        </div>
        <div className="space-y-0.5">
          <p className="text-lg font-bold tabular-nums">
            <PriceColor deal={deal} />
          </p>
          <MsrpIndicator deal={deal} />
        </div>
        <p className="text-xs text-muted-foreground">{deal.seller}</p>
        {deal.notes && (
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
            {deal.notes}
          </p>
        )}
      </CardContent>
      <div className="px-4 pb-4">
        <a href={deal.url} target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="w-full">
            View Listing
          </Button>
        </a>
      </div>
    </Card>
  );
}

function DealSection({
  title,
  subtitle,
  deals,
  accentColor,
}: {
  title: string;
  subtitle: string;
  deals: Deal[];
  accentColor: string;
}) {
  if (deals.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-6 rounded-full ${accentColor}`} />
        <div>
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}

function RetailerQuickLinks() {
  const iconColorMap: Record<string, string> = {
    shopping: "bg-blue-500/10 text-blue-400",
    auction: "bg-amber-500/10 text-amber-500",
    graded: "bg-violet-500/10 text-violet-400",
    live: "bg-red-500/10 text-red-400",
    community: "bg-emerald-500/10 text-emerald-500",
  };

  const iconSvgMap: Record<string, JSX.Element> = {
    shopping: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    auction: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    graded: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    live: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    community: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full bg-sky-500" />
        <div>
          <h2 className="text-base font-bold text-foreground">Quick Links</h2>
          <p className="text-xs text-muted-foreground">
            Jump to F1 card sections on popular retailers
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {retailerLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="h-full hover:border-primary/40 transition-colors cursor-pointer">
              <CardContent className="pt-4 pb-4 px-4 space-y-2">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${iconColorMap[link.icon]}`}>
                  {iconSvgMap[link.icon]}
                </div>
                <h3 className="text-sm font-semibold text-foreground leading-tight">
                  {link.name}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {link.description}
                </p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}

function CasePriceBreakdown({ deal }: { deal: Deal }) {
  if (deal.category !== 'case' || !deal.price) return null;
  const isChrome = deal.product.toLowerCase().includes('chrome');
  const isDynasty = deal.product.toLowerCase().includes('dynasty');
  const boxCount = isChrome ? 12 : isDynasty ? 5 : 1;
  if (boxCount <= 1) return null;
  const perBox = Math.round(deal.price / boxCount);
  return (
    <div className="mt-1 flex items-center gap-2">
      <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
        {boxCount} boxes = ${perBox}/box
      </Badge>
    </div>
  );
}

export default function DealsListings() {
  const hotDeals = getHotDeals();
  const belowMsrp = getBelowMsrpDeals();
  const premiumSingles = getPremiumSingles();
  const inStockBoxes = getInStockBoxes();
  const watchList = getWatchList();
  const casesInStock = getCaseDealsInStock();
  const casesWatch = getCaseDealsWatchlist();
  const dynastyInStock = getDynastyInStock();
  const dynastyWatch = getDynastyWatchlist();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Deals & Listings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curated deals on Topps F1 sealed boxes, cases, singles, and where to buy
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] text-muted-foreground shrink-0">
          Last updated: Mar 14, 2026
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Hot Deals</p>
            <p className="text-lg font-bold text-emerald-500 tabular-nums">{hotDeals.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Below MSRP</p>
            <p className="text-lg font-bold text-blue-400 tabular-nums">{belowMsrp.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cases</p>
            <p className="text-lg font-bold text-orange-400 tabular-nums">{casesInStock.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Dynasty 2025</p>
            <p className="text-lg font-bold text-yellow-400 tabular-nums">{dynastyInStock.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Premium Singles</p>
            <p className="text-lg font-bold text-violet-400 tabular-nums">{premiumSingles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">In Stock</p>
            <p className="text-lg font-bold text-amber-500 tabular-nums">{inStockBoxes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Watch List</p>
            <p className="text-lg font-bold text-red-400 tabular-nums">{watchList.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Deal Sections */}
      <DealSection
        title="Hot Deals"
        subtitle="In stock at good prices — act fast"
        deals={hotDeals}
        accentColor="bg-emerald-500"
      />

      {/* Cases Section */}
      {casesInStock.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-orange-500" />
            <div>
              <h2 className="text-base font-bold text-foreground">2025 Chrome F1 — Full Cases (12 boxes)</h2>
              <p className="text-xs text-muted-foreground">Buy a full case for the best per-box price. MSRP $250/box = $3,000/case</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {casesInStock.map((deal) => (
              <Card key={deal.id} className="flex flex-col justify-between">
                <CardContent className="pt-4 pb-3 px-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {deal.seller}
                    </h3>
                    <AvailabilityBadge deal={deal} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-lg font-bold tabular-nums text-foreground">
                      {deal.priceDisplay}
                    </p>
                    <CasePriceBreakdown deal={deal} />
                  </div>
                  {deal.notes && (
                    <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                      {deal.notes}
                    </p>
                  )}
                </CardContent>
                <div className="px-4 pb-4">
                  <a href={deal.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="w-full" data-testid={`case-deal-${deal.id}`}>
                      View Listing
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
          {casesWatch.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sold Out — Watch for Restocks</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {casesWatch.map((deal) => (
                  <a key={deal.id} href={deal.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-md border border-border hover:border-primary/30 transition-colors group">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground group-hover:text-primary truncate">{deal.seller}</p>
                      <p className="text-[10px] text-muted-foreground/60">{deal.notes}</p>
                    </div>
                    <span className="text-[10px] text-primary shrink-0">Monitor ↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dynasty 2025 Section */}
      {(dynastyInStock.length > 0 || dynastyWatch.length > 0) && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-yellow-500" />
            <div>
              <h2 className="text-base font-bold text-foreground">2025 Dynasty F1 — Boxes & Cases</h2>
              <p className="text-xs text-muted-foreground">Buy multiple boxes from the same seller. MSRP $1,200/box. Cases are 5 boxes.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {dynastyInStock.map((deal) => (
              <Card key={deal.id} className="flex flex-col justify-between">
                <CardContent className="pt-4 pb-3 px-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {deal.product}
                    </h3>
                    <AvailabilityBadge deal={deal} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-lg font-bold tabular-nums text-foreground">
                      {deal.priceDisplay}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{deal.seller}</p>
                    <CasePriceBreakdown deal={deal} />
                  </div>
                  {deal.notes && (
                    <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                      {deal.notes}
                    </p>
                  )}
                </CardContent>
                <div className="px-4 pb-4">
                  <a href={deal.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="w-full" data-testid={`dynasty-deal-${deal.id}`}>
                      View Listing
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
          {dynastyWatch.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sold Out — Watch for Restocks</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {dynastyWatch.map((deal) => (
                  <a key={deal.id} href={deal.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-md border border-border hover:border-primary/30 transition-colors group">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground group-hover:text-primary truncate">{deal.product} — {deal.seller}</p>
                      <p className="text-[10px] text-muted-foreground/60">{deal.notes}</p>
                    </div>
                    <span className="text-[10px] text-primary shrink-0">Monitor ↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <DealSection
        title="Below MSRP Opportunities"
        subtitle="Priced below or near MSRP — availability varies"
        deals={belowMsrp}
        accentColor="bg-blue-500"
      />

      <DealSection
        title="Premium Singles"
        subtitle="Dynasty & graded cards for serious collectors"
        deals={premiumSingles}
        accentColor="bg-violet-500"
      />

      <DealSection
        title="Sealed Boxes In Stock"
        subtitle="All currently available boxes by retailer"
        deals={inStockBoxes}
        accentColor="bg-amber-500"
      />

      <DealSection
        title="Watch List"
        subtitle="Sold out — monitor for restocks"
        deals={watchList}
        accentColor="bg-red-500"
      />

      {/* Quick Links */}
      <RetailerQuickLinks />
    </div>
  );
}
