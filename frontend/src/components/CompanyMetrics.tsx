import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TrendingUp, DollarSign, BarChart3, Users } from "lucide-react";

interface Company {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  volume: string;
  marketCap: string;
  sector: string;
}

interface CompanyMetricsProps {
  company: Company;
}

const CompanyMetrics = ({ company }: CompanyMetricsProps) => {
  const metrics = [
    {
      title: "Market Cap",
      value: company.marketCap,
      icon: DollarSign,
      change: "+2.3%",
      positive: true
    },
    {
      title: "Volume",
      value: company.volume,
      icon: BarChart3,
      change: "+15.7%",
      positive: true
    },
    {
      title: "P/E Ratio",
      value: (15 + Math.random() * 10).toFixed(1),
      icon: TrendingUp,
      change: "-0.8%",
      positive: false
    },
    {
      title: "52W High",
      value: `$${(company.currentPrice * (1.2 + Math.random() * 0.3)).toFixed(2)}`,
      icon: Users,
      change: "+8.2%",
      positive: true
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Key Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <metric.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{metric.title}</p>
                <p className="text-lg font-bold text-foreground">{metric.value}</p>
              </div>
            </div>
            <div className={`text-sm font-medium ${
              metric.positive ? 'text-success' : 'text-destructive'
            }`}>
              {metric.change}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CompanyMetrics;