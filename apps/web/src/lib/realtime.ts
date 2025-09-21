/**
 * Enterprise Real-Time Data System
 * Google-style real-time data management with WebSocket and SSE support
 */

export interface RealtimeConfig {
  websocketUrl: string;
  sseUrl: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

export interface RealtimeMessage {
  type: string;
  data: any;
  timestamp: number;
  id: string;
}

export interface RealtimeSubscription {
  id: string;
  type: string;
  callback: (data: any) => void;
  unsubscribe: () => void;
}

class EnterpriseRealtimeManager {
  private config: RealtimeConfig;
  private websocket: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private subscriptions: Map<string, RealtimeSubscription> = new Map();
  private reconnectAttempts = 0;
  private isConnected = false;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(config: RealtimeConfig) {
    this.config = config;
    this.initializeConnection();
  }

  private initializeConnection() {
    // Try WebSocket first, fallback to SSE
    if (typeof WebSocket !== 'undefined') {
      this.initializeWebSocket();
    } else {
      this.initializeSSE();
    }
  }

  private initializeWebSocket() {
    try {
      this.websocket = new WebSocket(this.config.websocketUrl);
      
      this.websocket.onopen = () => {
        console.log('🚀 ENTERPRISE: WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.notifySubscribers('connection', { status: 'connected' });
      };

      this.websocket.onmessage = (event) => {
        try {
          const message: RealtimeMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('🚀 ENTERPRISE: WebSocket message parse error:', error);
        }
      };

      this.websocket.onclose = () => {
        console.log('🚀 ENTERPRISE: WebSocket disconnected');
        this.isConnected = false;
        this.stopHeartbeat();
        this.scheduleReconnect();
      };

      this.websocket.onerror = (error) => {
        console.error('🚀 ENTERPRISE: WebSocket error:', error);
        this.isConnected = false;
      };
    } catch (error) {
      console.error('🚀 ENTERPRISE: WebSocket initialization failed:', error);
      this.initializeSSE();
    }
  }

  private initializeSSE() {
    try {
      this.eventSource = new EventSource(this.config.sseUrl);
      
      this.eventSource.onopen = () => {
        console.log('🚀 ENTERPRISE: SSE connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.notifySubscribers('connection', { status: 'connected' });
      };

      this.eventSource.onmessage = (event) => {
        try {
          const message: RealtimeMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('🚀 ENTERPRISE: SSE message parse error:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('🚀 ENTERPRISE: SSE error:', error);
        this.isConnected = false;
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('🚀 ENTERPRISE: SSE initialization failed:', error);
    }
  }

  private handleMessage(message: RealtimeMessage) {
    // Notify all subscribers of this message type
    this.subscriptions.forEach((subscription) => {
      if (subscription.type === message.type || subscription.type === '*') {
        try {
          subscription.callback(message.data);
        } catch (error) {
          console.error('🚀 ENTERPRISE: Subscription callback error:', error);
        }
      }
    });
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`🚀 ENTERPRISE: Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      this.reconnectTimer = setTimeout(() => {
        this.initializeConnection();
      }, delay);
    } else {
      console.error('🚀 ENTERPRISE: Max reconnection attempts reached');
      this.notifySubscribers('connection', { status: 'failed' });
    }
  }

  private notifySubscribers(type: string, data: any) {
    this.subscriptions.forEach((subscription) => {
      if (subscription.type === type || subscription.type === '*') {
        try {
          subscription.callback(data);
        } catch (error) {
          console.error('🚀 ENTERPRISE: Notification callback error:', error);
        }
      }
    });
  }

  public subscribe(type: string, callback: (data: any) => void): RealtimeSubscription {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: RealtimeSubscription = {
      id,
      type,
      callback,
      unsubscribe: () => {
        this.subscriptions.delete(id);
      }
    };

    this.subscriptions.set(id, subscription);
    return subscription;
  }

  public send(type: string, data: any) {
    if (this.isConnected && this.websocket) {
      const message: RealtimeMessage = {
        type,
        data,
        timestamp: Date.now(),
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      this.websocket.send(JSON.stringify(message));
    } else {
      console.warn('🚀 ENTERPRISE: Cannot send message - not connected');
    }
  }

  public getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      subscriptionCount: this.subscriptions.size
    };
  }

  public disconnect() {
    this.stopHeartbeat();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.isConnected = false;
    this.subscriptions.clear();
  }
}

// Enterprise configuration
const realtimeConfig: RealtimeConfig = {
  websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001/ws',
  sseUrl: process.env.NEXT_PUBLIC_SSE_URL || '/api/realtime/sse',
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000
};

// Singleton instance
export const realtimeManager = new EnterpriseRealtimeManager(realtimeConfig);

// React hook for easy integration (client-side only)
export function useRealtime() {
  // This will be implemented in a separate client-side file
  return {
    isConnected: realtimeManager.getConnectionStatus().isConnected,
    subscribe: (type: string, callback: (data: any) => void) => {
      return realtimeManager.subscribe(type, callback);
    },
    send: (type: string, data: any) => {
      realtimeManager.send(type, data);
    },
    connectionStatus: realtimeManager.getConnectionStatus()
  };
}

// React hooks are imported at the bottom to avoid server-side issues
