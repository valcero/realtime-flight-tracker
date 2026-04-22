export function formatAltitude(meters) {
  if (meters == null || !Number.isFinite(meters)) return "N/A";
  const feet = Math.round(meters * 3.281);
  return `${feet.toLocaleString()} ft`;
}

export function formatSpeed(ms) {
  if (ms == null || !Number.isFinite(ms)) return "N/A";
  const kmh = Math.round(ms * 3.6);
  return `${kmh} km/h`;
}

export function getVerticalStatus(verticalRate) {
  if (verticalRate == null || !Number.isFinite(verticalRate)) {
    return { label: "Level", symbol: "→" };
  }
  if (verticalRate > 0.5) {
    return { label: "Climbing", symbol: "↑" };
  }
  if (verticalRate < -0.5) {
    return { label: "Descending", symbol: "↓" };
  }
  return { label: "Level", symbol: "→" };
}
