import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketWatch } from "./MarketWatch";
import { OrderForm } from "./OrderForm";
import { Portfolio } from "./Portfolio";
import { OrderHistory } from "./OrderHistory";
import { OpenOrders } from "./OpenOrders";
import { Watchlist } from "./Watchlist";
import { FyersAPI } from "@/lib/fyers-api";

export function TradingDashboard({ api }: { api: FyersAPI }) {
  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: () => api.getPositions(),
    refetchInterval: 5000,
  });

  const totalPnL = positions?.reduce((sum, pos) => sum + pos.pnl, 0) || 0;

  return (
    <div className="min-h-screen bg-trading-background text-white p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <Card className="bg-trading-card">
          <CardHeader>
            <CardTitle>Trading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">
              MTM P&L:{" "}
              <span className={totalPnL >= 0 ? "text-trading-success" : "text-trading-danger"}>
                ₹{totalPnL.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Tabs defaultValue="watchlist">
              <TabsList className="w-full bg-trading-background">
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                <TabsTrigger value="market">Market Watch</TabsTrigger>
                <TabsTrigger value="positions">Positions</TabsTrigger>
              </TabsList>
              <TabsContent value="watchlist">
                <Watchlist api={api} />
              </TabsContent>
              <TabsContent value="market">
                <MarketWatch api={api} />
              </TabsContent>
              <TabsContent value="positions">
                <Portfolio api={api} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <OrderForm api={api} />
          </div>
        </div>

        <Tabs defaultValue="open-orders">
          <TabsList className="w-full bg-trading-background">
            <TabsTrigger value="open-orders">Open Orders</TabsTrigger>
            <TabsTrigger value="order-history">Order History</TabsTrigger>
          </TabsList>
          <TabsContent value="open-orders">
            <OpenOrders api={api} />
          </TabsContent>
          <TabsContent value="order-history">
            <OrderHistory api={api} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}