const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const { fetchOpenSkyStates } = require("./opensky");
const { filterAirborneFlights } = require("./filterFlights");
const { selectActiveFlights } = require("./selectFlights");

const PORT = Number(process.env.PORT) || 3000;
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS) || 10_000;

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

let lastPayload = null;

async function pollAndBroadcast() {
  try {
    const { time, states } = await fetchOpenSkyStates();
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
  }
}

io.on("connection", (socket) => {
  socket.emit("server:ready", { ok: true, timestamp: Date.now() });
  if (lastPayload) socket.emit("flights:update", lastPayload);
});

httpServer.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
  console.log(`[poll] polling OpenSky every ${POLL_INTERVAL_MS}ms`);

  pollAndBroadcast();
  setInterval(pollAndBroadcast, POLL_INTERVAL_MS);
});

