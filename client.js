const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => console.log("connected", socket.id));
socket.on("server:ready", (msg) => console.log("server:ready", msg));
socket.on("flights:update", (msg) => console.log("flights:update", msg));
socket.on("disconnect", () => console.log("disconnected"));