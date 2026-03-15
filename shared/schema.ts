import { pgTable, text, serial, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  productType: text("product_type").notNull(),
  format: text("format").notNull(),
  releaseDate: text("release_date"),
  msrp: real("msrp"),
  currentMarket: real("current_market"),
  marketHigh: real("market_high"),
  marketLow: real("market_low"),
  config: text("config"),
  status: text("status").notNull(),
  notes: text("notes"),
  trending: text("trending"),
  roi: real("roi"),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const watchlistItems = pgTable("watchlist_items", {
  id: serial("id").primaryKey(),
  cardName: text("card_name").notNull(),
  year: integer("year").notNull(),
  productLine: text("product_line").notNull(),
  lastPrice: real("last_price"),
  targetPrice: real("target_price"),
  notes: text("notes"),
  status: text("status").notNull(),
});

export const insertWatchlistSchema = createInsertSchema(watchlistItems).omit({ id: true });
export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type WatchlistItem = typeof watchlistItems.$inferSelect;
