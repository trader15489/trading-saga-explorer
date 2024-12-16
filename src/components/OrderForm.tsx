import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FyersAPI } from "@/lib/fyers-api";
import { toast } from "sonner";

export function OrderForm({ api }: { api: FyersAPI }) {
  const [orderData, setOrderData] = useState({
    symbol: "",
    quantity: "",
    type: "MARKET",
    side: "BUY",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.placeOrder(orderData);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Order placement failed:", error);
    }
  };

  return (
    <Card className="bg-trading-card text-white">
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={orderData.symbol}
              onChange={(e) => setOrderData({ ...orderData, symbol: e.target.value })}
              className="bg-trading-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={orderData.quantity}
              onChange={(e) => setOrderData({ ...orderData, quantity: e.target.value })}
              className="bg-trading-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Order Type</Label>
            <Select onValueChange={(value) => setOrderData({ ...orderData, type: value })}>
              <SelectTrigger className="bg-trading-background">
                <SelectValue placeholder="Select order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MARKET">Market</SelectItem>
                <SelectItem value="LIMIT">Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="side">Side</Label>
            <Select onValueChange={(value) => setOrderData({ ...orderData, side: value })}>
              <SelectTrigger className="bg-trading-background">
                <SelectValue placeholder="Select side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUY">Buy</SelectItem>
                <SelectItem value="SELL">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-trading-accent hover:bg-trading-accent/90">
            Place Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}