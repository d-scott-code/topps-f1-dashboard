import type { Product, InsertProduct, WatchlistItem, InsertWatchlist } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProductsByYear(year: number): Promise<Product[]>;
  getProductsByType(type: string): Promise<Product[]>;
  addProduct(product: InsertProduct): Promise<Product>;
  getWatchlist(): Promise<WatchlistItem[]>;
  addWatchlistItem(item: InsertWatchlist): Promise<WatchlistItem>;
  removeWatchlistItem(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product> = new Map();
  private watchlist: Map<number, WatchlistItem> = new Map();
  private productId = 1;
  private watchlistId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    const products: InsertProduct[] = [
      // 2025 Products
      {
        name: "2025 Topps Chrome F1",
        year: 2025,
        productType: "Chrome",
        format: "Hobby Box",
        releaseDate: "Jan 22, 2026",
        msrp: 249.99,
        currentMarket: 375,
        marketHigh: 420,
        marketLow: 240,
        config: "21 packs (20+1 anniversary), 4 cards/pack, 12 boxes/case",
        status: "Released",
        notes: "75th Anniversary edition. Most autographs & rookies ever in F1 Chrome. The Grail chase (1:5,951 packs).",
        trending: "up",
        roi: 50.0,
      },
      {
        name: "2025 Topps Chrome F1",
        year: 2025,
        productType: "Chrome",
        format: "Value Blaster",
        releaseDate: "Jan 22, 2026",
        msrp: 29.99,
        currentMarket: 32,
        marketHigh: 35,
        marketLow: 29.99,
        config: "6 packs, 4 cards/pack, 40 boxes/case",
        status: "Released",
        notes: "Retail product. Four & More and Top Speed inserts exclusive to blasters.",
        trending: "flat",
        roi: 6.7,
      },
      {
        name: "2025 Topps Chrome Sapphire F1",
        year: 2025,
        productType: "Sapphire",
        format: "Hobby Box",
        releaseDate: "Feb 12, 2026",
        msrp: 499.99,
        currentMarket: 949,
        marketHigh: 1070,
        marketLow: 849,
        config: "8 packs, 4 cards/pack, 10 boxes/case",
        status: "Released",
        notes: "Largest rookie lineup ever. Premium Sapphire finish. Case: $4,499.99 from Topps.",
        trending: "up",
        roi: 89.8,
      },
      {
        name: "2025 Topps Chrome LogoFractor F1",
        year: 2025,
        productType: "LogoFractor",
        format: "Mega Box",
        releaseDate: "Jan 29, 2026",
        msrp: 549.99,
        currentMarket: 620,
        marketHigh: 650,
        marketLow: 592,
        config: "6 packs (2 LogoFractor + 4 Chrome), Fanatics London exclusive initially",
        status: "Released",
        notes: "Second LogoFractor edition. F1 logo heavily featured on every card.",
        trending: "up",
        roi: 12.7,
      },
      {
        name: "2025 Topps Dynasty F1",
        year: 2025,
        productType: "Dynasty",
        format: "Hobby Box",
        releaseDate: "Nov 19, 2025",
        msrp: 1199.99,
        currentMarket: 1300,
        marketHigh: 1400,
        marketLow: 1100,
        config: "1 Encased Autographed Patch Card /10 or less",
        status: "Released",
        notes: "Ultra-premium. Every card numbered /10 or less with on-card auto + patch.",
        trending: "up",
        roi: 8.3,
      },
      {
        name: "2025 Topps Lights Out F1",
        year: 2025,
        productType: "Lights Out",
        format: "Hobby Box",
        releaseDate: "Aug 2025",
        msrp: 560,
        currentMarket: 1050,
        marketHigh: 1100,
        marketLow: 800,
        config: "4 cards total, 2 guaranteed autographs. UK Fanatics exclusive.",
        status: "Released",
        notes: "UK exclusive. Sold out fast. Massive secondary market premium.",
        trending: "up",
        roi: 87.5,
      },
      {
        name: "2025 Topps Finest F1",
        year: 2025,
        productType: "Finest",
        format: "Hobby Box",
        releaseDate: "TBD",
        msrp: null,
        currentMarket: null,
        marketHigh: null,
        marketLow: null,
        config: "TBD",
        status: "Rumored Cancelled",
        notes: "Multiple Reddit sources report no 2025 Finest or Paddock Pass. Unconfirmed.",
        trending: null,
        roi: null,
      },
      {
        name: "2025 Topps Paddock Pass F1",
        year: 2025,
        productType: "Paddock Pass",
        format: "Hobby Box",
        releaseDate: "TBD",
        msrp: null,
        currentMarket: null,
        marketHigh: null,
        marketLow: null,
        config: "TBD",
        status: "Rumored Cancelled",
        notes: "Rumored cancelled for 2025 season. Fan-favorite product line.",
        trending: null,
        roi: null,
      },
      {
        name: "2025 Topps Turbo Attax F1",
        year: 2025,
        productType: "Turbo Attax",
        format: "Various",
        releaseDate: "Mid-2025",
        msrp: 5,
        currentMarket: 5,
        marketHigh: 25,
        marketLow: 3,
        config: "Sticker/trading card packs. Multiple pack sizes.",
        status: "Released",
        notes: "Entry-level product. Released around Silverstone/Austrian GP.",
        trending: "flat",
        roi: 0,
      },

      // 2024 Products
      {
        name: "2024 Topps Chrome F1",
        year: 2024,
        productType: "Chrome",
        format: "Hobby Box",
        releaseDate: "Nov 22, 2024",
        msrp: 239.99,
        currentMarket: 180,
        marketHigh: 260,
        marketLow: 160,
        config: "12 packs, 8 cards/pack, 12 boxes/case",
        status: "Released",
        notes: "Demand cooled. Available below MSRP. Good value buy?",
        trending: "down",
        roi: -25.0,
      },
      {
        name: "2024 Topps Chrome Sapphire F1",
        year: 2024,
        productType: "Sapphire",
        format: "Hobby Box",
        releaseDate: "~Feb 2025",
        msrp: 1199.99,
        currentMarket: 1100,
        marketHigh: 1400,
        marketLow: 950,
        config: "8 packs, 4 cards/pack",
        status: "Released",
        notes: "Secondary market slightly below MSRP. Case: $14,999.95 MSRP.",
        trending: "down",
        roi: -8.3,
      },
      {
        name: "2024 Topps Dynasty F1",
        year: 2024,
        productType: "Dynasty",
        format: "Hobby Box",
        releaseDate: "~Nov 2024",
        msrp: 1199.99,
        currentMarket: 1100,
        marketHigh: 1300,
        marketLow: 900,
        config: "1 Encased Auto Patch Card",
        status: "Released",
        notes: "Bottas Driver Dual Relic Auto /10 recently listed at $479.",
        trending: "down",
        roi: -8.3,
      },
      {
        name: "2024 Topps Finest F1",
        year: 2024,
        productType: "Finest",
        format: "Hobby Box",
        releaseDate: "~2024",
        msrp: 250,
        currentMarket: 250,
        marketHigh: 350,
        marketLow: 200,
        config: "Hobby box format",
        status: "Released",
        notes: "Holding at MSRP. Decent auto hits.",
        trending: "flat",
        roi: 0,
      },
      {
        name: "2024 Topps Paddock Pass F1",
        year: 2024,
        productType: "Paddock Pass",
        format: "Hobby Box",
        releaseDate: "~2024",
        msrp: 349.95,
        currentMarket: 300,
        marketHigh: 400,
        marketLow: 280,
        config: "Hobby box format",
        status: "Released",
        notes: "Below MSRP. May be last Paddock Pass release.",
        trending: "down",
        roi: -14.3,
      },

      // 2023 Products
      {
        name: "2023 Topps Chrome F1",
        year: 2023,
        productType: "Chrome",
        format: "Hobby Box",
        releaseDate: "~Jan 2024",
        msrp: 239.99,
        currentMarket: 275,
        marketHigh: 350,
        marketLow: 220,
        config: "Hobby box format",
        status: "Released",
        notes: "Stabilizing above MSRP.",
        trending: "flat",
        roi: 14.6,
      },
      {
        name: "2023 Topps Chrome Sapphire F1",
        year: 2023,
        productType: "Sapphire",
        format: "Hobby Box",
        releaseDate: "~Mar 2024",
        msrp: 800,
        currentMarket: 850,
        marketHigh: 1000,
        marketLow: 700,
        config: "8 packs, 4 cards/pack",
        status: "Released",
        notes: "Slight premium over MSRP.",
        trending: "flat",
        roi: 6.3,
      },

      // 2022 Products
      {
        name: "2022 Topps Chrome F1",
        year: 2022,
        productType: "Chrome",
        format: "Hobby Box",
        releaseDate: "Jan 4, 2023",
        msrp: 200,
        currentMarket: 450,
        marketHigh: 550,
        marketLow: 350,
        config: "18 packs, 4 cards/pack, 12 boxes/case",
        status: "Released",
        notes: "Strong appreciation. Verstappen dominance era.",
        trending: "up",
        roi: 125.0,
      },
      {
        name: "2022 Topps Chrome Sapphire F1",
        year: 2022,
        productType: "Sapphire",
        format: "Hobby Box",
        releaseDate: "~2023",
        msrp: 600,
        currentMarket: 1350,
        marketHigh: 1600,
        marketLow: 1100,
        config: "8 packs, 4 cards/pack",
        status: "Released",
        notes: "Excellent appreciation. Limited print run.",
        trending: "up",
        roi: 125.0,
      },

      // 2021 Products
      {
        name: "2021 Topps Chrome F1",
        year: 2021,
        productType: "Chrome",
        format: "Hobby Box",
        releaseDate: "~2022",
        msrp: 175,
        currentMarket: 600,
        marketHigh: 750,
        marketLow: 450,
        config: "18 packs, 4 cards/pack",
        status: "Released",
        notes: "Hamilton vs Verstappen title fight season. Strong demand.",
        trending: "up",
        roi: 242.9,
      },

      // 2020 Products (FIRST YEAR)
      {
        name: "2020 Topps Chrome F1",
        year: 2020,
        productType: "Chrome",
        format: "Hobby Box",
        releaseDate: "Apr 23, 2021",
        msrp: 150,
        currentMarket: 2090,
        marketHigh: 2105,
        marketLow: 1425,
        config: "18 packs, 4 cards/pack, 12 boxes/case",
        status: "Released",
        notes: "FIRST EVER Chrome F1! Last sold $2,089.98 (Mar 2, 2026). Was $1,750 in Mar 2025.",
        trending: "up",
        roi: 1293.3,
      },
      {
        name: "2020 Topps Chrome Sapphire F1",
        year: 2020,
        productType: "Sapphire",
        format: "Hobby Box",
        releaseDate: "~2021",
        msrp: 300,
        currentMarket: 3300,
        marketHigh: 3900,
        marketLow: 2000,
        config: "8 packs, 4 cards/pack",
        status: "Released",
        notes: "Grail product. Recent sales: $3,050-$3,700 on eBay. Was $2,000-$2,700 in 2023.",
        trending: "up",
        roi: 1000.0,
      },
      {
        name: "2020 Topps Dynasty F1",
        year: 2020,
        productType: "Dynasty",
        format: "Hobby Box",
        releaseDate: "~2021",
        msrp: 800,
        currentMarket: 3500,
        marketHigh: 5000,
        marketLow: 2000,
        config: "100-card base checklist /10. On-card auto + patch.",
        status: "Released",
        notes: "Ultra-premium first-year Dynasty. Singles from $999 (Wolff) to $19,900 (Norris PSA 9).",
        trending: "up",
        roi: 337.5,
      },
    ];

    for (const p of products) {
      const id = this.productId++;
      this.products.set(id, { ...p, id });
    }

    // Seed watchlist
    const watchlistItems: InsertWatchlist[] = [
      {
        cardName: "2020 Chrome F1 Hobby Box (Sealed)",
        year: 2020,
        productLine: "Chrome",
        lastPrice: 2090,
        targetPrice: 1500,
        notes: "Wait for dip below $1,800. Last sold $2,090 on Mar 2.",
        status: "Watching",
      },
      {
        cardName: "2020 Dynasty Lando Norris Triple Relic Auto /10",
        year: 2020,
        productLine: "Dynasty",
        lastPrice: 3900,
        targetPrice: 3000,
        notes: "Multiple listings at $3,490-$3,900. PSA 9 would be a buy.",
        status: "Watching",
      },
      {
        cardName: "2020 Dynasty Charles Leclerc Auto Patch /10",
        year: 2020,
        productLine: "Dynasty",
        lastPrice: 11900,
        targetPrice: 9000,
        notes: "PSA 9, Silver /10. On sale from $14,900. Ferrari move makes this a long-term hold.",
        status: "Watching",
      },
      {
        cardName: "2024 Chrome F1 Hobby Box",
        year: 2024,
        productLine: "Chrome",
        lastPrice: 180,
        targetPrice: 150,
        notes: "Below MSRP of $240. Could be a buy-the-dip opportunity at $150.",
        status: "Buy Zone",
      },
      {
        cardName: "2020 Chrome Sapphire F1 Hobby Box",
        year: 2020,
        productLine: "Sapphire",
        lastPrice: 3300,
        targetPrice: 2500,
        notes: "Grail sealed product. Recent range $3,050-$3,700. Hard to find under $3k now.",
        status: "Watching",
      },
    ];

    for (const item of watchlistItems) {
      const id = this.watchlistId++;
      this.watchlist.set(id, { ...item, id });
    }
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByYear(year: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.year === year);
  }

  async getProductsByType(type: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.productType === type);
  }

  async addProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async getWatchlist(): Promise<WatchlistItem[]> {
    return Array.from(this.watchlist.values());
  }

  async addWatchlistItem(item: InsertWatchlist): Promise<WatchlistItem> {
    const id = this.watchlistId++;
    const newItem = { ...item, id };
    this.watchlist.set(id, newItem);
    return newItem;
  }

  async removeWatchlistItem(id: number): Promise<void> {
    this.watchlist.delete(id);
  }
}

export const storage = new MemStorage();
