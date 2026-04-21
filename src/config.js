const { DEFAULT_OPEN_SKY_URL } = require("./opensky");

function toNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

const config = {
  port: toNumber(process.env.PORT, 3000),
  pollIntervalMs: toNumber(process.env.POLL_INTERVAL_MS, 10_000),
  openSkyUrl: process.env.OPENSKY_URL || DEFAULT_OPEN_SKY_URL,
  openSkyTimeoutMs: toNumber(process.env.OPENSKY_TIMEOUT_MS, 8000),
  corsOrigin: process.env.CORS_ORIGIN || "*"
};

module.exports = { config };

