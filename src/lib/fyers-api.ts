import { toast } from "sonner";

const API_BASE_URL = "https://api-t2.fyers.in/api/v3";

interface FyersCredentials {
  client_id: string;
  app_id: string;
  redirect_uri: string;
  app_type: string;
  app_secret?: string;
}

export class FyersAPI {
  private accessToken: string | null = null;
  private credentials: FyersCredentials;

  constructor(credentials: FyersCredentials) {
    this.credentials = credentials;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
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

  async getProfile() {
    return this.request("/profile");
  }

  async getMarketData(symbols: string[]) {
    return this.request("/market-data", {
      method: "POST",
      body: JSON.stringify({ symbols }),
    });
  }

  async getPositions() {
    return this.request("/positions");
  }

  async placeOrder(orderData: any) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }
}