import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import useFlightSocket, {
  CONNECTION_STATUS,
} from "./src/hooks/useFlightSocket";
import { SERVER_URL } from "./src/config";

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

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Server: {SERVER_URL}
        </Text>
        {lastUpdate && (
          <Text style={styles.subtitle}>
            Last update: {new Date(lastUpdate).toLocaleTimeString()}
          </Text>
        )}
        <Text style={styles.subtitle}>
          Flights: {flights.length}
        </Text>

        {flights.map((flight) => (
          <View key={flight.icao24} style={styles.flightCard}>
            <Text style={styles.callsign}>
              {flight.callsign || "N/A"}
            </Text>
            <Text style={styles.detail}>ICAO: {flight.icao24}</Text>
            <Text style={styles.detail}>
              Position: {flight.lat?.toFixed(4)}, {flight.lon?.toFixed(4)}
            </Text>
            <Text style={styles.detail}>
              Altitude: {flight.baroAltitude?.toFixed(0)} m
            </Text>
            <Text style={styles.detail}>
              Speed: {flight.velocity?.toFixed(1)} m/s
            </Text>
            <Text style={styles.detail}>
              Vertical Rate: {flight.verticalRate?.toFixed(1)} m/s
            </Text>
          </View>
        ))}

        {flights.length === 0 && connectionStatus === CONNECTION_STATUS.CONNECTED && (
          <Text style={styles.empty}>No active flights at the moment</Text>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    color: "#8892b0",
    fontSize: 13,
    marginBottom: 4,
  },
  flightCard: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  callsign: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e2e8f0",
    marginBottom: 8,
  },
  detail: {
    color: "#8892b0",
    fontSize: 14,
    marginBottom: 2,
  },
  empty: {
    color: "#8892b0",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});
