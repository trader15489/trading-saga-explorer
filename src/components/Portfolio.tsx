import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FyersAPI } from "@/lib/fyers-api";

export function Portfolio({ api }: { api: FyersAPI }) {
  const { data: positions, isLoading } = useQuery({
    queryKey: ["positions"],
    queryFn: () => api.getPositions(),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading positions...</div>;
  }

  return (
    <Card className="bg-trading-card text-white">
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Average Price</TableHead>
              <TableHead>P&L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions?.map((position: any) => (
              <TableRow key={position.symbol}>
                <TableCell>{position.symbol}</TableCell>
                <TableCell>{position.quantity}</TableCell>
                <TableCell>{position.averagePrice}</TableCell>
                <TableCell className={position.pnl >= 0 ? "text-trading-success" : "text-trading-danger"}>
                  {position.pnl}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}