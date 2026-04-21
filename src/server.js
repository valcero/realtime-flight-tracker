const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const { fetchOpenSkyStates } = require("./opensky");
const { filterAirborneFlights } = require("./filterFlights");
const { selectActiveFlights } = require("./selectFlights");
const { config } = require("./config");

const app = express();
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"]
  }
});

let lastPayload = null;
let pollInFlight = false;
let pollTimer = null;

async function pollAndBroadcast() {
  if (pollInFlight) return;
  pollInFlight = true;

  try {
    const { time, states } = await fetchOpenSkyStates({
      url: config.openSkyUrl,
      timeoutMs: config.openSkyTimeoutMs
    });
    const airborneFlights = filterAirborneFlights(states);
    const selectedFlights = selectActiveFlights(airborneFlights, 2);

    const payload = {
      timestamp: Date.now(),
      sourceTime: time,
      flights: selectedFlights
    };

    lastPayload = payload;
    io.emit("flights:update", payload);
  } catch (err) {
    console.error("[poll] failed:", err?.message || err);
    // Keep server alive; do not crash on transient API errors.
    // If we have old data, clients will still see it on reconnect.
  } finally {
    pollInFlight = false;
  }
}

function scheduleNextPoll() {
  pollTimer = setTimeout(async () => {
    await pollAndBroadcast();
    scheduleNextPoll();
  }, config.pollIntervalMs);
}

io.on("connection", (socket) => {
  socket.emit("server:ready", { ok: true, timestamp: Date.now() });
  if (lastPayload) socket.emit("flights:update", lastPayload);
});

function shutdown(signal) {
  console.log(`[server] shutting down (${signal})...`);
  if (pollTimer) clearTimeout(pollTimer);
  io.close(() => {
    httpServer.close(() => process.exit(0));
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

httpServer.listen(config.port, () => {
  console.log(`[server] listening on http://localhost:${config.port}`);
  console.log(`[poll] interval=${config.pollIntervalMs}ms timeout=${config.openSkyTimeoutMs}ms`);

  pollAndBroadcast();
  scheduleNextPoll();
});

