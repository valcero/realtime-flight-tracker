import { StyleSheet, Text, View } from "react-native";
import {
  formatAltitude,
  formatSpeed,
  getVerticalStatus,
} from "../utils/formatters";

export default function FlightInfoCard({ flight }) {
  const { label: vertLabel, symbol: vertSymbol } = getVerticalStatus(
    flight.verticalRate
  );

  const vertColor =
    vertLabel === "Climbing"
      ? "#4CAF50"
      : vertLabel === "Descending"
        ? "#F44336"
        : "#8892b0";

  return (
    <View style={styles.card}>
      <Text style={styles.callsign}>
        {flight.callsign || "N/A"}
      </Text>
      <View style={styles.row}>
        <InfoItem label="Altitude" value={formatAltitude(flight.baroAltitude)} />
        <InfoItem label="Speed" value={formatSpeed(flight.velocity)} />
        <InfoItem
          label="Vertical"
          value={`${vertSymbol} ${vertLabel}`}
          valueColor={vertColor}
        />
      </View>
    </View>
  );
}

function InfoItem({ label, value, valueColor }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(22, 33, 62, 0.92)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  callsign: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e2e8f0",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#cbd5e1",
  },
});
