function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function toCallsign(raw) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length ? trimmed : null;
}
//function to convert vector to objects
function mapStateVectorToFlight(state) {
  return {
    icao24: typeof state?.[0] === "string" ? state[0] : null,
    callsign: toCallsign(state?.[1]),
    lon: state?.[5] ?? null,
    lat: state?.[6] ?? null,
    baroAltitude: state?.[7] ?? null,
    onGround: state?.[8] ?? null,
    velocity: state?.[9] ?? null,
    heading: state?.[10] ?? null,
    geoAltitude: state?.[13] ?? null,
    timePosition: state?.[3] ?? null,
    lastContact: state?.[4] ?? null
  };
}
//filtering airborne rules
function filterAirborneFlights(states) {
  if (!Array.isArray(states)) return [];

  const result = [];

  for (const state of states) {
    if (!Array.isArray(state)) continue;

    const onGround = state[8];
    const velocity = state[9];
    const baroAltitude = state[7];
    const lon = state[5];
    const lat = state[6];

    if (onGround !== false) continue;
    if (!isNumber(velocity) || velocity <= 50) continue;
    if (!isNumber(baroAltitude) || baroAltitude <= 3000) continue;
    if (lon == null || lat == null) continue;

    result.push(mapStateVectorToFlight(state));
  }

  return result;
}

module.exports = {
  filterAirborneFlights,
  mapStateVectorToFlight
};