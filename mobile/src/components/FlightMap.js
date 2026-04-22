import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const INDIA_REGION = {
  latitude: 22.5,
  longitude: 82.5,
  latitudeDelta: 30,
  longitudeDelta: 30,
};

export default function FlightMap({ flights }) {
  return (
    <MapView style={styles.map} initialRegion={INDIA_REGION}>
      {flights.map((flight) => {
        if (flight.lat == null || flight.lon == null) return null;

        return (
          <Marker
            key={flight.icao24}
            coordinate={{ latitude: flight.lat, longitude: flight.lon }}
            title={flight.callsign || flight.icao24}
            description={`Alt: ${flight.baroAltitude?.toFixed(0) ?? "?"} m  |  Spd: ${flight.velocity?.toFixed(0) ?? "?"} m/s`}
            pinColor="#4FC3F7"
          />
        );
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
