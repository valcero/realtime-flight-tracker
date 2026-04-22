import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { Marker, AnimatedRegion } from "react-native-maps";
import { formatAltitude, formatSpeed, getVerticalStatus } from "../utils/formatters";

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
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (flight.lat == null || flight.lon == null) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

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

  const { symbol } = getVerticalStatus(flight.verticalRate);
  const description = `${formatAltitude(flight.baroAltitude)}  |  ${formatSpeed(flight.velocity)}  |  ${symbol}`;

  return (
    <Marker.Animated
      ref={markerRef}
      coordinate={coordinateRef.current}
      title={flight.callsign || flight.icao24}
      description={description}
      pinColor="#4FC3F7"
    />
  );
}
