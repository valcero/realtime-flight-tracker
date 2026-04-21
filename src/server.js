const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.emit("server:ready", { ok: true, timestamp: Date.now() });
});

httpServer.listen(PORT, () => {
  // Minimal bootstrap only; flight polling/broadcast comes next.
  console.log(`[server] listening on http://localhost:${PORT}`);
});

