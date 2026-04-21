function toSortableNumber(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function selectActiveFlights(flights, count = 2) {
  if (!Array.isArray(flights) || count <= 0) return [];

  const sorted = [...flights].sort((a, b) => {
    const vA = toSortableNumber(a?.velocity, -1);
    const vB = toSortableNumber(b?.velocity, -1);
    if (vA !== vB) return vB - vA;

    const tA = toSortableNumber(a?.lastContact, -1);
    const tB = toSortableNumber(b?.lastContact, -1);
    if (tA !== tB) return tB - tA;

    const idA = typeof a?.icao24 === "string" ? a.icao24 : "";
    const idB = typeof b?.icao24 === "string" ? b.icao24 : "";
    return idA.localeCompare(idB);
  });
  return sorted.slice(0, count);
}
module.exports = {
  selectActiveFlights
};