# Realtime Flight Tracker

A real-time flight tracking project for an assignment.

## Setup

Requirements:

- Node.js **18+**

Install:

```bash
npm install
```

Run:

```bash
npm run dev
```

Health check:

- `GET /health` → `{ ok: true }`

## Real-time updates (Socket.IO)

The server emits flight updates on:

- Event: `flights:update`

Payload shape:

- `timestamp` (ms)
- `sourceTime` (OpenSky `time`, may be null)
- `flights` (array of up to 2 flights)

### Quick manual test (Node client)

Install the client library:

```bash
npm i socket.io-client
```

Create `client.js`:

```js
const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => console.log("connected", socket.id));
socket.on("server:ready", (msg) => console.log("server:ready", msg));
socket.on("flights:update", (msg) => console.log("flights:update", msg));
socket.on("disconnect", () => console.log("disconnected"));
```

Run it:

```bash
node client.js
```

## Configuration (env)

- `PORT` (default: `3000`)
- `POLL_INTERVAL_MS` (default: `10000`)
- `OPENSKY_URL` (default: India bbox OpenSky states endpoint)
- `OPENSKY_TIMEOUT_MS` (default: `8000`)
- `CORS_ORIGIN` (default: `*`)
