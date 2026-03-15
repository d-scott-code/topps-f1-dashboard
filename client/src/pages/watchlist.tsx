import { useState, useMemo } from "react";
import { products } from "@/lib/data";
import type { Product } from "@/lib/data";
import { findAllDeals, findBestDeal, type Deal, getPctVsMsrp, deals as allDeals } from "@/lib/deals-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ── Types ────────────────────────────────────────────────────────────
interface WatchItem {
  id: string; // product-{id} or custom-{timestamp}
  name: string;
  year: number;
  productType: string;
  format: string;
  targetPrice: number | null;
  msrp: number | null;
  currentMarket: number | null;
  notes: string;
  addedAt: number; // timestamp
}

// ── State management (React state — no localStorage in sandboxed iframe) ──

const DEFAULT_WATCH_ITEMS: WatchItem[] = [
  {
    id: "product-20",
    name: "2020 Topps Chrome F1",
    year: 2020,
    productType: "Chrome",
    format: "Hobby Box",
    targetPrice: 1800,
    msrp: 150,
    currentMarket: 2090,
    notes: "First-ever Chrome F1. Wait for dip below $1,800.",
    addedAt: Date.now() - 86400000 * 10,
  },
  {
    id: "product-21",
    name: "2020 Topps Chrome Sapphire F1",
    year: 2020,
    productType: "Sapphire",
    format: "Hobby Box",
    targetPrice: 2500,
    msrp: 300,
    currentMarket: 3300,
    notes: "Grail product. Hard to find under $3k.",
    addedAt: Date.now() - 86400000 * 9,
  },
  {
    id: "product-10",
    name: "2024 Topps Chrome F1",
    year: 2024,
    productType: "Chrome",
    format: "Hobby Box",
    targetPrice: 160,
    msrp: 240,
    currentMarket: 180,
    notes: "Below MSRP — buy-the-dip opportunity.",
    addedAt: Date.now() - 86400000 * 5,
  },
  {
    id: "dynasty-norris",
    name: "2020 Dynasty Norris Patch Auto",
    year: 2020,
    productType: "Dynasty",
    format: "Single",
    targetPrice: 3000,
    msrp: null,
    currentMarket: 3490,
    notes: "PSA 9 Triple Relic. Norris WDC boosted values.",
    addedAt: Date.now() - 86400000 * 3,
  },
  {
    id: "dynasty-leclerc",
    name: "2020 Dynasty Leclerc Auto Patch",
    year: 2020,
    productType: "Dynasty",
    format: "Single",
    targetPrice: 9000,
    msrp: null,
    currentMarket: 11900,
    notes: "PSA 9 Silver /10. Ferrari long-term hold.",
    addedAt: Date.now() - 86400000 * 2,
  },
];

// ── Availability Badge ───────────────────────────────────────────────
function AvailabilityDot({ deal }: { deal: Deal }) {
  if (deal.availability === "in_stock") return <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="In Stock" />;
  if (deal.availability === "sold_out") return <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Sold Out" />;
  return <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" title="Unknown availability" />;
}

// ── Target price indicator ───────────────────────────────────────────
function TargetIndicator({ item, bestPrice }: { item: WatchItem; bestPrice: number | null }) {
  if (!item.targetPrice) return null;
  const current = bestPrice || item.currentMarket;
  if (!current) return null;

  const pctAway = ((current - item.targetPrice) / current) * 100;
  const atTarget = current <= item.targetPrice;

  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
        <span>Target: ${item.targetPrice.toLocaleString()}</span>
        <span>Best: ${current.toLocaleString()}</span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`absolute h-full rounded-full transition-all ${atTarget ? "bg-emerald-500" : "bg-primary/30"}`}
          style={{ width: `${Math.min((item.targetPrice / current) * 100, 100)}%` }}
        />
        <div
          className="absolute h-full w-0.5 bg-emerald-500"
          style={{ left: `${Math.min((item.targetPrice / current) * 100, 100)}%` }}
        />
      </div>
      {atTarget ? (
        <p className="text-[10px] text-emerald-500 font-semibold mt-1">
          ✓ At or below target price — buy signal
        </p>
      ) : (
        <p className="text-[10px] text-muted-foreground mt-1">
          {pctAway.toFixed(0)}% above target
        </p>
      )}
    </div>
  );
}

// ── Deal listing for a watched item ──────────────────────────────────
function WatchItemDeals({ item }: { item: WatchItem }) {
  const relatedDeals = findAllDeals(item.year, item.productType);
  const [showAll, setShowAll] = useState(false);
  const visibleDeals = showAll ? relatedDeals : relatedDeals.slice(0, 3);

  if (relatedDeals.length === 0) {
    return (
      <div className="mt-3 p-2 rounded bg-muted/30 border border-border/50">
        <p className="text-[10px] text-muted-foreground">No active listings found. Check back later or browse retailers.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-1.5">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        {relatedDeals.length} listing{relatedDeals.length !== 1 ? "s" : ""} found
      </p>
      {visibleDeals.map((deal) => (
        <a
          key={deal.id}
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 p-2 rounded border border-border/50 hover:border-primary/40 hover:bg-muted/30 transition-colors group"
          data-testid={`watchlist-deal-${deal.id}`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <AvailabilityDot deal={deal} />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {deal.seller}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{deal.notes.slice(0, 60)}{deal.notes.length > 60 ? "…" : ""}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold tabular-nums text-foreground">{deal.priceDisplay}</p>
            <span className="text-[10px] text-primary font-medium group-hover:underline">View ↗</span>
          </div>
        </a>
      ))}
      {relatedDeals.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-[10px] text-primary hover:underline pl-1"
          data-testid="button-show-more-deals"
        >
          {showAll ? "Show fewer" : `Show all ${relatedDeals.length} listings`}
        </button>
      )}
    </div>
  );
}

// ── Add to Watchlist Dialog ──────────────────────────────────────────
function AddWatchlistDialog({
  isOpen,
  onClose,
  onAdd,
  existingIds,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: WatchItem) => void;
  existingIds: Set<string>;
}) {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customTarget, setCustomTarget] = useState("");
  const [customNote, setCustomNote] = useState("");

  // Build list of addable items (products not already in watchlist)
  const addableProducts = useMemo(() => {
    return products
      .filter(p => !existingIds.has(`product-${p.id}`) && p.status === "Released")
      .filter(p => {
        if (!search) return true;
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.productType.toLowerCase().includes(q) || p.format.toLowerCase().includes(q) || p.year.toString().includes(q);
      });
  }, [search, existingIds]);

  if (!isOpen) return null;

  const handleAdd = (product: Product) => {
    const target = customTarget ? parseFloat(customTarget) : null;
    onAdd({
      id: `product-${product.id}`,
      name: product.name,
      year: product.year,
      productType: product.productType,
      format: product.format,
      targetPrice: target,
      msrp: product.msrp,
      currentMarket: product.currentMarket,
      notes: customNote || product.notes || "",
      addedAt: Date.now(),
    });
    setSelectedProduct(null);
    setCustomTarget("");
    setCustomNote("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-t-xl sm:rounded-lg shadow-2xl w-full sm:max-w-lg max-h-[85vh] sm:max-h-[80vh] flex flex-col sm:m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-bold text-foreground">Add to Watchlist</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Pick a product and set your target price</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1" data-testid="button-close-dialog">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-border shrink-0">
          <input
            type="text"
            placeholder="Search products (e.g. '2025 Chrome', 'Dynasty')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-testid="input-search-products"
            autoFocus
          />
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1.5">
          {addableProducts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              {search ? "No matching products found" : "All products are already in your watchlist"}
            </p>
          )}
          {addableProducts.map((product) => {
            const isSelected = selectedProduct?.id === product.id;
            const bestDeal = findBestDeal(product.year, product.productType);
            return (
              <div key={product.id}>
                <button
                  onClick={() => setSelectedProduct(isSelected ? null : product)}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/30"
                  }`}
                  data-testid={`button-select-product-${product.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.format} · {product.year} · {product.productType}</p>
                    </div>
                    <div className="text-right">
                      {product.currentMarket && (
                        <p className="text-sm font-bold tabular-nums">${product.currentMarket.toLocaleString()}</p>
                      )}
                      {bestDeal && (
                        <p className="text-[10px] text-emerald-500">Best: {bestDeal.priceDisplay}</p>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded: target price + note */}
                {isSelected && (
                  <div className="mt-2 p-3 border border-border rounded-md bg-muted/20 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Target Price ($)</label>
                        <input
                          type="number"
                          placeholder="e.g. 1500"
                          value={customTarget}
                          onChange={(e) => setCustomTarget(e.target.value)}
                          className="w-full mt-1 bg-background border border-border rounded px-2 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/50"
                          data-testid="input-target-price"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Note (optional)</label>
                        <input
                          type="text"
                          placeholder="Your note..."
                          value={customNote}
                          onChange={(e) => setCustomNote(e.target.value)}
                          className="w-full mt-1 bg-background border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          data-testid="input-custom-note"
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(product)}
                      className="w-full"
                      data-testid="button-confirm-add"
                    >
                      Add to Watchlist
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Edit Target Dialog ───────────────────────────────────────────────
function EditTargetInline({
  item,
  onSave,
  onCancel,
}: {
  item: WatchItem;
  onSave: (targetPrice: number | null, notes: string) => void;
  onCancel: () => void;
}) {
  const [target, setTarget] = useState(item.targetPrice?.toString() || "");
  const [notes, setNotes] = useState(item.notes);

  return (
    <div className="mt-3 p-3 border border-primary/30 rounded-md bg-primary/5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Target Price ($)</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full mt-1 bg-background border border-border rounded px-2 py-1.5 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-testid="input-edit-target"
          />
        </div>
        <div>
          <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mt-1 bg-background border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            data-testid="input-edit-notes"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(target ? parseFloat(target) : null, notes)} data-testid="button-save-target">
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} data-testid="button-cancel-edit">
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Main Watchlist Page ──────────────────────────────────────────────
export default function Watchlist() {
  const [items, setItems] = useState<WatchItem[]>(DEFAULT_WATCH_ITEMS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const existingIds = useMemo(() => new Set(items.map(i => i.id)), [items]);

  const addItem = (item: WatchItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (expandedId === id) setExpandedId(null);
    if (editingId === id) setEditingId(null);
  };

  const updateItem = (id: string, targetPrice: number | null, notes: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, targetPrice, notes } : i));
    setEditingId(null);
  };

  // Separate items into alert/normal
  const alertItems = items.filter(item => {
    if (!item.targetPrice) return false;
    const bestDeal = findBestDeal(item.year, item.productType);
    const bestPrice = bestDeal?.price || item.currentMarket;
    return bestPrice !== null && bestPrice !== undefined && bestPrice <= item.targetPrice;
  });
  const watchingItems = items.filter(item => !alertItems.includes(item));

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-foreground">Watchlist</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Track products, set target prices, and see live availability
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAddDialog(true)}
          data-testid="button-add-watchlist"
          className="shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Product
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tracking</p>
            <p className="text-lg font-bold tabular-nums">{items.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Buy Alerts</p>
            <p className="text-lg font-bold text-emerald-500 tabular-nums">{alertItems.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 px-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Deals Found</p>
            <p className="text-lg font-bold text-primary tabular-nums">
              {items.reduce((sum, item) => sum + findAllDeals(item.year, item.productType).length, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Buy Alerts */}
      {alertItems.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-emerald-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Buy Alerts — At or Below Target
          </h2>
          {alertItems.map(item => {
            const bestDeal = findBestDeal(item.year, item.productType);
            const isExpanded = expandedId === item.id;
            return (
              <Card key={item.id} className="border-emerald-500/30">
                <CardContent className="py-4 px-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                        <Badge variant="outline" className="text-[10px]">{item.productType}</Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                          BUY SIGNAL
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span>{item.format} · {item.year}</span>
                        {item.msrp && <span>MSRP: ${item.msrp.toLocaleString()}</span>}
                        <span className="tabular-nums">Target: ${item.targetPrice?.toLocaleString()}</span>
                      </div>
                      {bestDeal && (
                        <a
                          href={bestDeal.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-sm text-emerald-500 hover:underline font-semibold"
                          data-testid={`alert-best-deal-${item.id}`}
                        >
                          Buy now at {bestDeal.priceDisplay} from {bestDeal.seller} ↗
                        </a>
                      )}
                      {item.notes && <p className="text-xs text-muted-foreground mt-1.5">{item.notes}</p>}

                      <TargetIndicator item={item} bestPrice={bestDeal?.price || null} />

                      {/* Toggle deals */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="text-[10px] text-primary hover:underline mt-2"
                        data-testid={`button-toggle-deals-${item.id}`}
                      >
                        {isExpanded ? "Hide all listings" : "Show all listings"}
                      </button>
                      {isExpanded && <WatchItemDeals item={item} />}

                      {editingId === item.id && (
                        <EditTargetInline
                          item={item}
                          onSave={(tp, n) => updateItem(item.id, tp, n)}
                          onCancel={() => setEditingId(null)}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                        className="text-muted-foreground hover:text-foreground text-xs"
                        data-testid={`button-edit-${item.id}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive text-xs"
                        data-testid={`button-remove-${item.id}`}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Watching */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Watching ({watchingItems.length})
        </h2>
        {watchingItems.map(item => {
          const bestDeal = findBestDeal(item.year, item.productType);
          const isExpanded = expandedId === item.id;
          return (
            <Card key={item.id}>
              <CardContent className="py-4 px-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{item.productType}</Badge>
                      <Badge variant="outline" className="text-[10px]">{item.format}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span>Year: {item.year}</span>
                      {item.msrp && <span>MSRP: ${item.msrp.toLocaleString()}</span>}
                      {item.currentMarket && <span className="tabular-nums">Market: ${item.currentMarket.toLocaleString()}</span>}
                      {item.targetPrice && <span className="tabular-nums text-primary">Target: ${item.targetPrice.toLocaleString()}</span>}
                    </div>

                    {bestDeal && (
                      <a
                        href={bestDeal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs text-primary hover:underline font-medium"
                        data-testid={`watch-best-deal-${item.id}`}
                      >
                        Best price: {bestDeal.priceDisplay} at {bestDeal.seller} ↗
                      </a>
                    )}

                    {item.notes && <p className="text-xs text-muted-foreground mt-1.5">{item.notes}</p>}

                    <TargetIndicator item={item} bestPrice={bestDeal?.price || null} />

                    {/* Toggle deals */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-[10px] text-primary hover:underline mt-2"
                      data-testid={`button-toggle-deals-${item.id}`}
                    >
                      {isExpanded ? "Hide all listings" : "Show all listings"}
                    </button>
                    {isExpanded && <WatchItemDeals item={item} />}

                    {editingId === item.id && (
                      <EditTargetInline
                        item={item}
                        onSave={(tp, n) => updateItem(item.id, tp, n)}
                        onCancel={() => setEditingId(null)}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                      className="text-muted-foreground hover:text-foreground text-xs"
                      data-testid={`button-edit-${item.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive text-xs"
                      data-testid={`button-remove-${item.id}`}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No items in your watchlist</p>
          <Button size="sm" className="mt-3" onClick={() => setShowAddDialog(true)} data-testid="button-add-empty">
            Add your first product
          </Button>
        </div>
      )}

      {/* Add Dialog */}
      <AddWatchlistDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={(item) => {
          addItem(item);
          setShowAddDialog(false);
        }}
        existingIds={existingIds}
      />
    </div>
  );
}
