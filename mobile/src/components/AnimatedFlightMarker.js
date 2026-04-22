import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { Marker, AnimatedRegion } from "react-native-maps";

const ANIMATION_DURATION = 1000;

export default function AnimatedFlightMarker({ flight }) {
  const coordinateRef = useRef(
    new AnimatedRegion({
      latitude: flight.lat,
      longitude: flight.lon,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  );
  const markerRef = useRef(null);

  useEffect(() => {
    if (flight.lat == null || flight.lon == null) return;

    if (Platform.OS === "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(
          { latitude: flight.lat, longitude: flight.lon },
          ANIMATION_DURATION
        );
      }
    } else {
      coordinateRef.current
        .timing({
          latitude: flight.lat,
          longitude: flight.lon,
          duration: ANIMATION_DURATION,
          useNativeDriver: false,
        })
        .start();
    }
  }, [flight.lat, flight.lon]);

  if (flight.lat == null || flight.lon == null) return null;

  return (
    <Marker.Animated
      ref={markerRef}
      coordinate={coordinateRef.current}
      title={flight.callsign || flight.icao24}
      description={`Alt: ${flight.baroAltitude?.toFixed(0) ?? "?"} m  |  Spd: ${flight.velocity?.toFixed(0) ?? "?"} m/s`}
      pinColor="#4FC3F7"
    />
  );
}
