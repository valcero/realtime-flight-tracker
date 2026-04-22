# Realtime Flight Tracker

A full-stack real-time flight tracking application. A Node.js backend polls live flight data over India from the OpenSky Network API and pushes updates to a React Native mobile app via Socket.IO every 10 seconds. Flights appear as animated markers on a map with live altitude, speed, and climb/descend indicators.

## How It Works

```
OpenSky API ──(HTTP poll every 10s)──> Node.js Backend ──(Socket.IO)──> React Native App
```

1. The backend fetches all flight state vectors over India (lat 8-37, lon 68-97) from the OpenSky Network API.
2. It filters for genuinely airborne flights: not on the ground, velocity > 50 m/s, barometric altitude > 3000 m, and valid coordinates.
3. The top 2 fastest flights are selected and broadcast to all connected clients via Socket.IO.
4. The React Native app receives updates and renders each flight as an animated marker on a map, with info cards showing callsign, altitude, speed, and vertical status.

The mobile app never contacts the OpenSky API directly. All flight data flows through the backend.

## Project Structure

```
realtime-flight-tracker/
├── src/                        # Backend source
│   ├── server.js               # Express + Socket.IO server, polling loop
│   ├── opensky.js              # OpenSky API client with timeout handling
│   ├── filterFlights.js        # Airborne flight filtering and state vector mapping
│   ├── selectFlights.js        # Picks top 2 flights by velocity
│   └── config.js               # Environment-driven configuration
├── client.js                   # Quick CLI test client
├── package.json
│
└── mobile/                     # React Native (Expo) app
    ├── App.js                  # Root component — map, info cards, connection UI
    ├── src/
    │   ├── hooks/
    │   │   └── useFlightSocket.js   # Socket.IO connection with reconnect logic
    │   ├── components/
    │   │   ├── FlightMap.js         # MapView wrapper
    │   │   ├── AnimatedFlightMarker.js  # Smooth marker animation
    │   │   ├── FlightInfoCard.js    # Per-flight info display
    │   │   └── ConnectionBanner.js  # Disconnect/reconnect banner
    │   ├── utils/
    │   │   └── formatters.js        # Unit conversions and vertical status
    │   └── config.js               # Server URL (auto-detects Android emulator)
    └── package.json
```

## Running the Backend

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start in development mode (auto-restarts on file changes)
npm run dev

# Or start in production mode
npm start
```

The server starts on `http://localhost:3000`. Verify with:

```bash
curl http://localhost:3000/health
# → {"ok":true}
```

To see raw flight data in your terminal:

```bash
node client.js
```

### Backend Configuration (environment variables)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP/WebSocket server port |
| `POLL_INTERVAL_MS` | `10000` | How often to fetch from OpenSky (ms) |
| `OPENSKY_TIMEOUT_MS` | `8000` | Timeout for OpenSky API requests (ms) |
| `OPENSKY_URL` | India bounding box endpoint | Override the OpenSky API URL |
| `CORS_ORIGIN` | `*` | Allowed CORS origins |

## Running the React Native App

**Prerequisites:** Node.js 18+, Expo Go app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

```bash
cd mobile

# Install dependencies
npm install

# Start the Expo dev server
npx expo start
```

Scan the QR code with Expo Go on your phone. The app will connect to the backend at `localhost:3000` (iOS) or `10.0.2.2:3000` (Android emulator). If testing on a physical device over WiFi, update the server URL in `mobile/src/config.js` to your machine's LAN IP.

## Socket.IO Event Reference

| Event | Direction | Payload |
|---|---|---|
| `server:ready` | Server -> Client | `{ ok: true, timestamp }` |
| `flights:update` | Server -> Client | `{ timestamp, sourceTime, flights }` |

Each flight object:

```json
{
  "icao24": "70209b",
  "callsign": "BBC122",
  "lat": 22.7946,
  "lon": 86.5178,
  "baroAltitude": 11887.2,
  "onGround": false,
  "velocity": 295.26,
  "heading": 93.3,
  "verticalRate": -0.33,
  "geoAltitude": 12481.56,
  "timePosition": 1776864759,
  "lastContact": 1776864759
}
```

## Assumptions and Decisions

- **Socket.IO over raw WebSocket:** Socket.IO was chosen over a plain `ws` server because it provides built-in reconnection, heartbeats, and event-based messaging out of the box, which simplifies both backend and frontend code.
- **Top 2 by velocity:** The requirement says "pick any 2 active flights." Rather than random selection (which would cause markers to jump between unrelated flights), the backend picks the 2 fastest flights. This keeps the selection stable across consecutive polls while still being dynamic as the flight population changes.
- **Expo (not bare React Native):** Expo was chosen for faster setup and easier testing on physical devices via Expo Go, with no native build tooling required.
- **Filtering thresholds:** Flights must have velocity > 50 m/s and altitude > 3000 m. This filters out aircraft taxiing, taking off, or landing, ensuring only genuinely cruising flights are shown.
- **Stale data indicator:** If no update is received for 30+ seconds (e.g., OpenSky API is down), the app shows a "Stale" badge rather than removing the last known flight positions.
- **Unit conversions:** Info cards display altitude in feet and speed in km/h (aviation-friendly units). The raw data from OpenSky is in meters and m/s.

## What I Would Improve Given More Time

- **Persistent flight tracking:** Keep track of the same two flights across polls instead of re-selecting each cycle, so markers don't switch to different aircraft mid-session.
- **Flight heading rotation:** Rotate the marker icon to face the direction of travel using the `heading` field.
- **Custom marker icons:** Replace the default map pins with airplane icons for a more polished look.
- **Geolocation:** Center the map on the user's current location instead of a fixed India view.
- **Testing:** Add unit tests for the filtering and selection logic on the backend, and component tests for the React Native app.
- **Error retry with backoff in UI:** Show a countdown timer in the connection banner so users know when the next reconnect attempt will happen.
- **WebSocket authentication:** Add a simple token-based auth layer to prevent unauthorized clients from connecting.
- **Rate limiting:** Protect the OpenSky API calls with proper rate limiting to respect their usage policies.
- **Deployment:** Containerize the backend with Docker and add instructions for deploying to a cloud provider.
