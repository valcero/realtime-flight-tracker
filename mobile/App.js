import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import useFlightSocket, {
  CONNECTION_STATUS,
} from "./src/hooks/useFlightSocket";
import { SERVER_URL } from "./src/config";
import FlightMap from "./src/components/FlightMap";

function ConnectionIndicator({ status }) {
  const colors = {
    [CONNECTION_STATUS.CONNECTED]: "#4CAF50",
    [CONNECTION_STATUS.CONNECTING]: "#FF9800",
    [CONNECTION_STATUS.RECONNECTING]: "#FF9800",
    [CONNECTION_STATUS.DISCONNECTED]: "#F44336",
  };

  return (
    <View style={[styles.indicator, { backgroundColor: colors[status] }]}>
      <Text style={styles.indicatorText}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

export default function App() {
  const { flights, connectionStatus, lastUpdate } =
    useFlightSocket(SERVER_URL);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Flight Tracker</Text>
        <ConnectionIndicator status={connectionStatus} />
      </View>

      <FlightMap flights={flights} />

      {flights.length === 0 && connectionStatus === CONNECTION_STATUS.CONNECTED && (
        <View style={styles.emptyOverlay}>
          <Text style={styles.emptyText}>No active flights at the moment</Text>
        </View>
      )}
    </View>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  indicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  indicatorText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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
});
