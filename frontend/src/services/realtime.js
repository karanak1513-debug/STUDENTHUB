// Client Realtime Database Synchronization Service
// Connects via WebSocket (/ws) with automatic Server-Sent Events (SSE) fallback

function getBackendUrls() {
  if (typeof window === 'undefined') {
    return { wsUrl: '', sseUrl: '' };
  }

  if (import.meta.env.VITE_WS_URL) {
    const wsUrl = import.meta.env.VITE_WS_URL;
    const sseUrl = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/realtime/stream`
      : '/api/realtime/stream';
    return { wsUrl, sseUrl };
  }

  if (import.meta.env.VITE_API_URL) {
    try {
      const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
      const urlObj = new URL(apiUrl, window.location.href);
      const isWss = urlObj.protocol === 'https:';
      const wsUrl = `${isWss ? 'wss:' : 'ws:'}//${urlObj.host}/ws`;
      const sseUrl = `${apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`}/realtime/stream`;
      return { wsUrl, sseUrl };
    } catch {
      // Fallback if URL parsing fails
    }
  }

  // Same-origin fallback (when frontend is served by the backend or a proxy)
  const isSecure = window.location.protocol === 'https:';
  const wsUrl = `${isSecure ? 'wss:' : 'ws:'}//${window.location.host}/ws`;
  const sseUrl = '/api/realtime/stream';
  return { wsUrl, sseUrl };
}

class RealtimeClient {
  constructor() {
    this.ws = null;
    this.eventSource = null;
    this.listeners = new Set();
    this.statusListeners = new Set();
    this.status = 'disconnected'; // 'connected' | 'reconnecting' | 'disconnected'
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  init() {
    if (typeof window === 'undefined') return;
    this.connectWebSocket();
  }

  setStatus(newStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach((cb) => {
        try { cb(newStatus); } catch (e) { console.error(e); }
      });
    }
  }

  connectWebSocket() {
    try {
      const { wsUrl } = getBackendUrls();
      if (!wsUrl) return;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.setStatus('connected');
        this.reconnectAttempts = 0;
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        console.log('⚡ Realtime SQLite connection active via WebSocket');
      };

      this.ws.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          this.notifyListeners(payload);
        } catch (e) {
          console.warn('Realtime parse error:', e);
        }
      };

      this.ws.onerror = () => {
        // Fallback to SSE if WS fails
        if (this.status !== 'connected') {
          this.connectSSE();
        }
      };

      this.ws.onclose = () => {
        this.setStatus('reconnecting');
        this.scheduleReconnect();
      };
    } catch (err) {
      console.warn('WebSocket init failed, switching to SSE fallback:', err);
      this.connectSSE();
    }
  }

  connectSSE() {
    if (this.eventSource) return;
    try {
      const { sseUrl } = getBackendUrls();
      if (!sseUrl) return;

      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        this.setStatus('connected');
        this.reconnectAttempts = 0;
        console.log('⚡ Realtime SQLite connection active via SSE');
      };

      this.eventSource.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          this.notifyListeners(payload);
        } catch (e) {
          console.warn('SSE parse error:', e);
        }
      };

      this.eventSource.onerror = () => {
        this.setStatus('reconnecting');
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        this.scheduleReconnect();
      };
    } catch (e) {
      console.error('SSE connection failed:', e);
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setStatus('disconnected');
      return;
    }
    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      this.connectWebSocket();
    }, delay);
  }

  notifyListeners(payload) {
    this.listeners.forEach((cb) => {
      try {
        cb(payload);
      } catch (err) {
        console.error('Realtime listener error:', err);
      }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  onStatusChange(callback) {
    this.statusListeners.add(callback);
    callback(this.status);
    return () => this.statusListeners.delete(callback);
  }

  getStatus() {
    return this.status;
  }
}

export const realtimeClient = new RealtimeClient();
if (typeof window !== 'undefined') {
  realtimeClient.init();
}
