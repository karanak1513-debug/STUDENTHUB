import { WebSocketServer, WebSocket } from 'ws';

// In-memory set of connected WebSocket clients
const wsClients = new Set();
// In-memory set of SSE response objects
const sseClients = new Set();

let wss = null;

export function setupRealtimeServer(httpServer) {
  wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    wsClients.add(ws);
    // Send initial handshake
    ws.send(JSON.stringify({
      event: 'CONNECTED',
      data: { message: 'Realtime WebSocket Database connection established', clientId: Date.now() },
      timestamp: Date.now(),
    }));

    ws.on('message', (message) => {
      try {
        const parsed = JSON.parse(message);
        if (parsed.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
        }
      } catch (err) {}
    });

    ws.on('close', () => {
      wsClients.delete(ws);
    });

    ws.on('error', () => {
      wsClients.delete(ws);
    });
  });

  console.log('⚡ Realtime WebSocket Database stream listening on /ws');
}

// Server-Sent Events (SSE) route handler for fallback or REST clients
export function sseHandler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  res.write(`data: ${JSON.stringify({ event: 'CONNECTED', message: 'SSE Stream Active', timestamp: Date.now() })}\n\n`);
  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
}

// Universal broadcast to all connected WebSocket and SSE clients
export function broadcast(event, data) {
  const payload = JSON.stringify({
    event,
    data,
    timestamp: Date.now(),
  });

  // Broadcast to WebSockets
  for (const client of wsClients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(payload);
      } catch (err) {
        wsClients.delete(client);
      }
    }
  }

  // Broadcast to SSE clients
  for (const res of sseClients) {
    try {
      res.write(`data: ${payload}\n\n`);
    } catch (err) {
      sseClients.delete(res);
    }
  }
}
