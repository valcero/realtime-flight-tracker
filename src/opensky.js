const DEFAULT_OPEN_SKY_URL =
  "https://opensky-network.org/api/states/all?lamin=8.0&lomin=68.0&lamax=37.0&lomax=97.0";

function assertOkResponse(response) {
  if (!response.ok) {
    const err = new Error(
      `OpenSky request failed: ${response.status} ${response.statusText}`
    );
    err.status = response.status;
    throw err;
  }
}

async function fetchOpenSkyStates(options = {}) {
  const url = options.url || DEFAULT_OPEN_SKY_URL;
  const timeoutMs = Number(options.timeoutMs) || 8000;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        accept: "application/json"
      }
    });

    assertOkResponse(response);

    const data = await response.json();
    const time = typeof data?.time === "number" ? data.time : null;
    const states = Array.isArray(data?.states) ? data.states : [];

    return { time, states };
  } catch (err) {
    if (err?.name === "AbortError") {
      const timeoutErr = new Error(`OpenSky request timed out after ${timeoutMs}ms`);
      timeoutErr.code = "OPEN_SKY_TIMEOUT";
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  DEFAULT_OPEN_SKY_URL,
  fetchOpenSkyStates
};