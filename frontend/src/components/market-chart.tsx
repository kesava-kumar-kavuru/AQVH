import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

// Mock FTSE 100 data
const mockData = [
  { time: "09:00", price: 7850, prediction: "up" },
  { time: "10:00", price: 7865, prediction: "up" },
  { time: "11:00", price: 7840, prediction: "down" },
  { time: "12:00", price: 7825, prediction: "down" },
  { time: "13:00", price: 7845, prediction: "up" },
  { time: "14:00", price: 7880, prediction: "up" },
  { time: "15:00", price: 7895, prediction: "up" },
  { time: "16:00", price: 7910, prediction: "up" },
];

export function MarketChart() {
  const currentPrice = 7910;
  const dailyChange = "+60 (+0.76%)";
  const quantumPrediction = "UP";
  const confidence = "87.3%";

  return (
    <Card className="quantum-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>FTSE 100 - Quantum Analysis</CardTitle>
          <Badge className={`quantum-glow ${quantumPrediction === "UP" ? "badge-up" : "badge-down"}`}>
            {quantumPrediction} {confidence}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold gradient-financial bg-clip-text text-transparent">
              {currentPrice.toLocaleString()}
            </span>
            <span className="text-accent font-medium">{dailyChange}</span>
          </div>

          {/* Mini Chart Visualization */}
          <div className="h-32 relative bg-muted/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-end justify-between h-full">
              {mockData.map((point, index) => (
                <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                  <div
                    className={`w-2 bg-gradient-to-t rounded-full ${
                      point.prediction === "up" 
                        ? "from-accent/60 to-accent" 
                        : "from-destructive/60 to-destructive"
                    }`}
                    style={{
                      height: `${((point.price - 7800) / 150) * 100}%`,
                      minHeight: "4px"
                    }}
                  />
                  <span className="text-xs text-muted-foreground rotate-45 mt-2">
                    {point.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantum Indicators */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center p-2 bg-primary/10 rounded border border-primary/20">
              <div className="text-xs text-muted-foreground">Volatility</div>
              <div className="font-semibold text-primary">Low</div>
            </div>
            <div className="text-center p-2 bg-secondary/10 rounded border border-secondary/20">
              <div className="text-xs text-muted-foreground">Momentum</div>
              <div className="font-semibold text-secondary">Strong</div>
            </div>
            <div className="text-center p-2 bg-accent/10 rounded border border-accent/20">
              <div className="text-xs text-muted-foreground">Signal</div>
              <div className="font-semibold text-accent">Buy</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}