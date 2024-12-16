import { toast } from "sonner";

const API_BASE_URL = "https://api-t2.fyers.in/api/v3";
const WS_URL = "wss://api-t2.fyers.in/socket/v3";

interface FyersCredentials {
  client_id: string;
  app_id: string;
  redirect_uri: string;
  app_type: string;
  app_secret?: string;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  pnl: number;
  lastPrice: number;
  product: string;
}

export interface Order {
  orderId: string;
  symbol: string;
  type: string;
  side: string;
  quantity: number;
  price: number;
  status: string;
  timestamp: string;
}

export class FyersAPI {
  private accessToken: string | null = null;
  private credentials: FyersCredentials;
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();

  constructor(credentials: FyersCredentials) {
    this.credentials = credentials;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    this.initializeWebSocket();
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: this.accessToken ? `Bearer ${this.accessToken}` : "",
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      toast.error("API Error: " + (error as Error).message);
      throw error;
    }
  }

  private initializeWebSocket() {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(`${WS_URL}?token=${this.accessToken}`);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const subscribers = this.subscribers.get(data.type);
      if (subscribers) {
        subscribers.forEach((callback) => callback(data));
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("WebSocket connection error");
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
      setTimeout(() => this.initializeWebSocket(), 5000); // Reconnect after 5 seconds
    };
  }

  subscribe(type: string, callback: (data: any) => void) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, new Set());
    }
    this.subscribers.get(type)?.add(callback);
  }

  unsubscribe(type: string, callback: (data: any) => void) {
    this.subscribers.get(type)?.delete(callback);
  }

  // Market Data Methods
  async getMarketData(symbols: string[]) {
    return this.request("/market-data", {
      method: "POST",
      body: JSON.stringify({ symbols }),
    });
  }

  // Position Methods
  async getPositions(): Promise<Position[]> {
    return this.request("/positions");
  }

  // Order Methods
  async getOrders(): Promise<Order[]> {
    return this.request("/orders");
  }

  async getOrderHistory(): Promise<Order[]> {
    return this.request("/orders/history");
  }

  async placeOrder(orderData: any) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async modifyOrder(orderId: string, orderData: any) {
    return this.request(`/orders/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(orderId: string) {
    return this.request(`/orders/${orderId}`, {
      method: "DELETE",
    });
  }

  // Watchlist Methods
  async getWatchlist() {
    return this.request("/watchlist");
  }

  async addToWatchlist(symbol: string) {
    return this.request("/watchlist", {
      method: "POST",
      body: JSON.stringify({ symbol }),
    });
  }

  async removeFromWatchlist(symbol: string) {
    return this.request(`/watchlist/${symbol}`, {
      method: "DELETE",
    });
  }
}