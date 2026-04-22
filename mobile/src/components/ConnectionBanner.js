import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CONNECTION_STATUS } from "../hooks/useFlightSocket";

const MESSAGES = {
  [CONNECTION_STATUS.DISCONNECTED]: "Connection lost",
  [CONNECTION_STATUS.RECONNECTING]: "Reconnecting...",
  [CONNECTION_STATUS.CONNECTING]: "Connecting...",
};

export default function ConnectionBanner({ status, onReconnect }) {
  if (status === CONNECTION_STATUS.CONNECTED) return null;

  const message = MESSAGES[status] || "Connecting...";
  const showRetry = status === CONNECTION_STATUS.DISCONNECTED;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{message}</Text>
      {showRetry && (
        <TouchableOpacity onPress={onReconnect} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 110,
    left: 16,
    right: 16,
    backgroundColor: "rgba(244, 67, 54, 0.92)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
