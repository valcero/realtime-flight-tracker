import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import AnimatedFlightMarker from "./AnimatedFlightMarker";

const INDIA_REGION = {
  latitude: 22.5,
  longitude: 82.5,
  latitudeDelta: 30,
  longitudeDelta: 30,
};

export default function FlightMap({ flights }) {
  return (
    <MapView style={styles.map} initialRegion={INDIA_REGION}>
      {flights.map((flight) => (
        <AnimatedFlightMarker key={flight.icao24} flight={flight} />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
