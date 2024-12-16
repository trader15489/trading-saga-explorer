import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FyersAPI } from "@/lib/fyers-api";
import { useState } from "react";
import { toast } from "sonner";

export function Watchlist({ api }: { api: FyersAPI }) {
  const [newSymbol, setNewSymbol] = useState("");
  const { data: watchlist, refetch } = useQuery({
    queryKey: ["watchlist"],
    queryFn: () => api.getWatchlist(),
  });

  const handleAddSymbol = async () => {
    try {
      await api.addToWatchlist(newSymbol);
      setNewSymbol("");
      refetch();
      toast.success("Symbol added to watchlist");
    } catch (error) {
      toast.error("Failed to add symbol");
    }
  };

  const handleRemoveSymbol = async (symbol: string) => {
    try {
      await api.removeFromWatchlist(symbol);
      refetch();
      toast.success("Symbol removed from watchlist");
    } catch (error) {
      toast.error("Failed to remove symbol");
    }
  };

  return (
    <Card className="bg-trading-card text-white">
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Enter symbol (e.g., NSE:RELIANCE-EQ)"
            className="bg-trading-background"
          />
          <Button onClick={handleAddSymbol} className="bg-trading-accent">
            Add
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>LTP</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watchlist?.map((item: any) => (
              <TableRow key={item.symbol}>
                <TableCell>{item.symbol}</TableCell>
                <TableCell>{item.ltp}</TableCell>
                <TableCell className={item.change >= 0 ? "text-trading-success" : "text-trading-danger"}>
                  {item.change}%
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveSymbol(item.symbol)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}