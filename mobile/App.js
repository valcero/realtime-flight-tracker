import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import useFlightSocket, {
  CONNECTION_STATUS,
} from "./src/hooks/useFlightSocket";
import { SERVER_URL } from "./src/config";
import FlightMap from "./src/components/FlightMap";
import FlightInfoCard from "./src/components/FlightInfoCard";
import ConnectionBanner from "./src/components/ConnectionBanner";

const STALE_THRESHOLD_MS = 30_000;

export default function App() {
  const { flights, connectionStatus, lastUpdate, reconnect } =
    useFlightSocket(SERVER_URL);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    if (!lastUpdate) return;
    setIsStale(false);

    const timer = setTimeout(() => setIsStale(true), STALE_THRESHOLD_MS);
    return () => clearTimeout(timer);
  }, [lastUpdate]);

  const isConnected = connectionStatus === CONNECTION_STATUS.CONNECTED;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>Flight Tracker</Text>
        <View style={styles.headerRight}>
          {isStale && (
            <View style={styles.staleBadge}>
              <Text style={styles.staleBadgeText}>Stale</Text>
            </View>
          )}
          <ConnectionDot connected={isConnected} />
        </View>
      </View>

      <FlightMap flights={flights} />

      <ConnectionBanner status={connectionStatus} onReconnect={reconnect} />

      {flights.length === 0 && isConnected && (
        <View style={styles.emptyOverlay}>
          <Text style={styles.emptyText}>
            No active flights at the moment
          </Text>
        </View>
      )}

      {flights.length > 0 && (
        <View style={styles.infoPanel}>
          {flights.map((flight) => (
            <FlightInfoCard key={flight.icao24} flight={flight} />
          ))}
        </View>
      )}
    </View>
  );
}

function ConnectionDot({ connected }) {
  return (
    <View
      style={[
        styles.dot,
        { backgroundColor: connected ? "#4CAF50" : "#F44336" },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#16213e",
    zIndex: 5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  staleBadge: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  staleBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  emptyOverlay: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  infoPanel: {
    position: "absolute",
    bottom: 30,
    left: 12,
    right: 12,
  },
});
