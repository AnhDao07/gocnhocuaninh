import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// Simple stateful memory to track server-level visitor stats safely
let serverVisitors = 14068; // default baseline matching localStorage

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. API: Get Visitor Statistics
  app.get("/api/stats/visitors", (req, res) => {
    // Return high-fidelity dynamic active readers
    const sec = Date.now() / 1000;
    const activeReaders = Math.floor(14 + Math.sin(sec / 120) * 4 + (Math.random() * 2));
    res.json({
      total_visitors: serverVisitors,
      active_readers: Math.max(2, activeReaders)
    });
  });

  // 2. API: Increment Visitor Count
  app.post("/api/stats/increment", (req, res) => {
    serverVisitors += 1;
    res.json({
      success: true,
      total_visitors: serverVisitors
    });
  });

  // 3. API: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", time: new Date().toISOString() });
  });

  // 4. Vite Dev Middleware / Production Static Host integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Góc nhỏ của Ninh] Server started successfully on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting backend server:", err);
});
