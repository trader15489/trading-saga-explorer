import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TradingDashboard } from "@/components/TradingDashboard";
import { FyersAPI } from "@/lib/fyers-api";
import { toast } from "sonner";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [api, setApi] = useState<FyersAPI | null>(null);
  const [credentials, setCredentials] = useState({
    client_id: "",
    app_id: "",
    redirect_uri: "",
    app_type: "100",
  });

  const handleLogin = () => {
    try {
      const fyersApi = new FyersAPI(credentials);
      setApi(fyersApi);
      setIsAuthenticated(true);
      toast.success("Successfully connected to Fyers!");
    } catch (error) {
      toast.error("Failed to connect to Fyers");
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-trading-background text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-trading-card">
          <CardHeader>
            <CardTitle>Connect to Fyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_id">Client ID</Label>
                <Input
                  id="client_id"
                  value={credentials.client_id}
                  onChange={(e) => setCredentials({ ...credentials, client_id: e.target.value })}
                  className="bg-trading-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="app_id">App ID</Label>
                <Input
                  id="app_id"
                  value={credentials.app_id}
                  onChange={(e) => setCredentials({ ...credentials, app_id: e.target.value })}
                  className="bg-trading-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="redirect_uri">Redirect URI</Label>
                <Input
                  id="redirect_uri"
                  value={credentials.redirect_uri}
                  onChange={(e) => setCredentials({ ...credentials, redirect_uri: e.target.value })}
                  className="bg-trading-background"
                />
              </div>

              <Button 
                onClick={handleLogin} 
                className="w-full bg-trading-accent hover:bg-trading-accent/90"
              >
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return api ? <TradingDashboard api={api} /> : null;
};

export default Index;