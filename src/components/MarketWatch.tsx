import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FyersAPI } from "@/lib/fyers-api";

const DEMO_SYMBOLS = ["NSE:NIFTY50-INDEX", "NSE:BANKNIFTY-INDEX", "NSE:RELIANCE-EQ"];

export function MarketWatch({ api }: { api: FyersAPI }) {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ["market-data"],
    queryFn: () => api.getMarketData(DEMO_SYMBOLS),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading market data...</div>;
  }

  return (
    <Card className="bg-trading-card text-white">
      <CardHeader>
        <CardTitle>Market Watch</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>LTP</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marketData?.map((item: any) => (
              <TableRow key={item.symbol}>
                <TableCell>{item.symbol}</TableCell>
                <TableCell>{item.ltp}</TableCell>
                <TableCell className={item.change >= 0 ? "text-trading-success" : "text-trading-danger"}>
                  {item.change}%
                </TableCell>
                <TableCell>{item.volume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}