import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FyersAPI } from "@/lib/fyers-api";

export function OrderHistory({ api }: { api: FyersAPI }) {
  const { data: orders } = useQuery({
    queryKey: ["order-history"],
    queryFn: () => api.getOrderHistory(),
  });

  return (
    <Card className="bg-trading-card text-white">
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.symbol}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.side}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{new Date(order.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}