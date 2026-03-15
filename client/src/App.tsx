import { Switch, Route, Router, Link, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import Dashboard from "./pages/dashboard";
import ProductCatalog from "./pages/product-catalog";
import PriceTracker from "./pages/price-tracker";
import Watchlist from "./pages/watchlist";
import DealsListings from "./pages/deals-listings";
import UpcomingReleases from "./pages/upcoming-releases";
import VintageFinds from "./pages/vintage-finds";
import NotFound from "./pages/not-found";
import { PerplexityAttribution } from "./components/PerplexityAttribution";

function AppLayout() {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { href: "/", label: "Overview", icon: "grid" },
    { href: "/catalog", label: "Product Catalog", icon: "layers" },
    { href: "/prices", label: "Price Tracker", icon: "trending-up" },
    { href: "/upcoming", label: "Upcoming Releases", icon: "calendar" },
    { href: "/vintage", label: "2020 Vintage Finds", icon: "gem" },
    { href: "/watchlist", label: "Watchlist", icon: "eye" },
    { href: "/deals", label: "Deals & Listings", icon: "tag" },
  ];

  const iconMap: Record<string, JSX.Element> = {
    grid: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    ),
    layers: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
    ),
    "trending-up": (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
    ),
    calendar: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ),
    gem: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3l3 6H2"/><path d="M13 3l-3 6h12"/></svg>
    ),
    eye: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    ),
    tag: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
    ),
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-60" : "w-16"} flex-shrink-0 border-r border-border bg-card transition-all duration-200 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border flex-shrink-0">
          <div className="flex-shrink-0">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="Topps F1 Tracker">
              <rect x="2" y="2" width="28" height="28" rx="6" className="fill-primary"/>
              <path d="M9 10h14v3H18v9h-4v-9H9v-3z" className="fill-primary-foreground"/>
              <circle cx="24" cy="22" r="4" className="fill-destructive" opacity="0.9"/>
              <text x="24" y="24.5" textAnchor="middle" fontSize="6" fontWeight="bold" className="fill-white">1</text>
            </svg>
          </div>
          {sidebarOpen && (
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm text-foreground">Topps F1</span>
              <span className="text-xs text-muted-foreground">Price Tracker</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  data-testid={`nav-${item.icon}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="flex-shrink-0">{iconMap[item.icon]}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Toggle */}
        <div className="border-t border-border px-2 py-2 flex-shrink-0">
          <button
            data-testid="button-toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sidebarOpen ? (
                <><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></>
              ) : (
                <><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></>
              )}
            </svg>
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/catalog" component={ProductCatalog} />
          <Route path="/prices" component={PriceTracker} />
          <Route path="/upcoming" component={UpcomingReleases} />
          <Route path="/vintage" component={VintageFinds} />
          <Route path="/watchlist" component={Watchlist} />
          <Route path="/deals" component={DealsListings} />
          <Route component={NotFound} />
        </Switch>
        <div className="px-6 pb-4">
          <PerplexityAttribution />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router hook={useHashLocation}>
        <AppLayout />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
