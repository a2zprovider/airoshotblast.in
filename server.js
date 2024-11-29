const express = require("express");
const WebSocket = require("ws");
const { createRequestHandler } = require("@remix-run/express");

const app = express();
const port = 4000; // Ensure the port matches

// WebSocket server setup
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", (message) => {
    console.log("Received:", message);
    ws.send(`Echo from server: ${message}`);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

app.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

app.all("*", createRequestHandler());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
