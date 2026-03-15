import { useState } from "react";
import { watchlistItems as initialWatchlist } from "@/lib/data";
import type { WatchlistItem } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>(initialWatchlist);

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const watching = items.filter(i => i.status === "Watching");
  const buyZone = items.filter(i => i.status === "Buy Zone");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Watchlist</h1>
        <p className="text-sm text-muted-foreground mt-1">Cards and products you're tracking for deals</p>
      </div>

      {/* Buy Zone */}
      {buyZone.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-emerald-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Buy Zone
          </h2>
          {buyZone.map(item => (
            <Card key={item.id} className="border-emerald-500/30">
              <CardContent className="py-4 px-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{item.cardName}</h3>
                      <Badge variant="outline" className="text-[10px]">{item.productLine}</Badge>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                        BUY
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Year: {item.year}</span>
                      <span className="tabular-nums">Last: ${item.lastPrice?.toLocaleString()}</span>
                      <span className="tabular-nums">Target: ${item.targetPrice?.toLocaleString()}</span>
                    </div>
                    {item.notes && <p className="text-xs text-muted-foreground mt-1.5">{item.notes}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-testid={`button-remove-${item.id}`}
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive text-xs"
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Watching */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Watching
        </h2>
        {watching.map(item => (
          <Card key={item.id}>
            <CardContent className="py-4 px-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">{item.cardName}</h3>
                    <Badge variant="outline" className="text-[10px]">{item.productLine}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Year: {item.year}</span>
                    <span className="tabular-nums">Last: ${item.lastPrice?.toLocaleString()}</span>
                    <span className="tabular-nums">Target: ${item.targetPrice?.toLocaleString()}</span>
                  </div>
                  {item.notes && <p className="text-xs text-muted-foreground mt-1.5">{item.notes}</p>}

                  {/* Price gap indicator */}
                  {item.lastPrice && item.targetPrice && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Target: ${item.targetPrice.toLocaleString()}</span>
                        <span>Last: ${item.lastPrice.toLocaleString()}</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-primary/30 rounded-full"
                          style={{ width: `${Math.min((item.targetPrice / item.lastPrice) * 100, 100)}%` }}
                        />
                        <div
                          className="absolute h-full w-0.5 bg-emerald-500"
                          style={{ left: `${Math.min((item.targetPrice / item.lastPrice) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {((1 - item.targetPrice / item.lastPrice) * 100).toFixed(0)}% below current for target
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid={`button-remove-${item.id}`}
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive text-xs"
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No items in your watchlist</p>
        </div>
      )}
    </div>
  );
}
