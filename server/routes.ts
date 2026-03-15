import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(server: Server, app: Express): Promise<Server> {
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/year/:year", async (req, res) => {
    const year = parseInt(req.params.year);
    const products = await storage.getProductsByYear(year);
    res.json(products);
  });

  app.get("/api/products/type/:type", async (req, res) => {
    const products = await storage.getProductsByType(req.params.type);
    res.json(products);
  });

  app.get("/api/watchlist", async (_req, res) => {
    const watchlist = await storage.getWatchlist();
    res.json(watchlist);
  });

  app.post("/api/watchlist", async (req, res) => {
    const item = await storage.addWatchlistItem(req.body);
    res.json(item);
  });

  app.delete("/api/watchlist/:id", async (req, res) => {
    await storage.removeWatchlistItem(parseInt(req.params.id));
    res.json({ success: true });
  });

  return server;
}
