import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Activity,
  RefreshCw,
  Download,
  Calendar,
  Volume2
} from "lucide-react";
import { fetchMarketData, type MarketData } from "../services/api";
import {
  Chart as ChartJS,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MarketDataPage = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMarketData = async () => {
    try {
      setRefreshing(true);
      const data = await fetchMarketData();
      setMarketData(data);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMarketData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const latestData = marketData[marketData.length - 1];
  const previousData = marketData[marketData.length - 2];
  const dailyChange = latestData && previousData ? latestData.close - previousData.close : 0;
  const dailyChangePercent = previousData ? (dailyChange / previousData.close) * 100 : 0;

  // Price chart data
  const priceChartData = {
    labels: marketData.map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'FTSE 100 Close Price',
        data: marketData.map(d => d.close),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        fill: true,
      },
    ],
  };

  // Volume chart data
  const volumeChartData = {
    labels: marketData.slice(-10).map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Trading Volume',
        data: marketData.slice(-10).map(d => d.volume),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'hsl(210 100% 95%)'
        }
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'hsl(210 20% 65%)',
        },
        grid: {
          color: 'hsl(225 15% 20%)'
        }
      },
      x: {
        ticks: {
          color: 'hsl(210 20% 65%)'
        },
        grid: {
          color: 'hsl(225 15% 20%)'
        }
      }
    }
  };

  const volumeOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          color: 'hsl(210 20% 65%)',
          callback: function(value: any) {
            return (value / 1000000).toFixed(1) + 'M';
          }
        }
      }
    }
  };

  // Calculate statistics
  const highPrice = Math.max(...marketData.map(d => d.high));
  const lowPrice = Math.min(...marketData.map(d => d.low));
  const avgVolume = marketData.reduce((sum, d) => sum + d.volume, 0) / marketData.length;
  const volatility = marketData.reduce((sum, d, i) => {
    if (i === 0) return 0;
    const prevClose = marketData[i - 1].close;
    const change = (d.close - prevClose) / prevClose;
    return sum + change * change;
  }, 0) / (marketData.length - 1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-quantum bg-clip-text text-transparent">
            Market Data
          </h1>
          <p className="text-muted-foreground">
            FTSE 100 real-time data and historical analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadMarketData} 
            disabled={refreshing}
            className="hover:border-primary/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="button-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Current Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4 text-primary" />
              Current Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{latestData?.close.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {dailyChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-accent" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={`text-sm font-medium ${dailyChange >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)} ({dailyChangePercent >= 0 ? '+' : ''}{dailyChangePercent.toFixed(2)}%)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-accent" />
              Day High/Low
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">High:</span>
                <span className="font-semibold text-accent">£{latestData?.high.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Low:</span>
                <span className="font-semibold text-destructive">£{latestData?.low.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Volume2 className="h-4 w-4 text-secondary" />
              Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {(latestData?.volume / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Avg: {(avgVolume / 1000000).toFixed(1)}M
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-orange-400" />
              Volatility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {(Math.sqrt(volatility) * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              30-day average
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Chart */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              FTSE 100 Price Movement
            </span>
            <Badge className="border border-primary/20 text-primary">
              30 Days
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={priceChartData} options={chartOptions} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-secondary" />
              Trading Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={volumeChartData} options={volumeOptions} />
          </CardContent>
        </Card>

        {/* Market Statistics */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Period Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Period High</span>
                <div className="text-xl font-bold text-accent">£{highPrice.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Period Low</span>
                <div className="text-xl font-bold text-destructive">£{lowPrice.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="border-t border-border/50 pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Return</span>
                  <span className="font-semibold">
                    {(((latestData?.close || 0) - marketData[0]?.close) / marketData[0]?.close * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                  <span className="font-semibold">1.42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Beta</span>
                  <span className="font-semibold">1.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Market Cap</span>
                  <span className="font-semibold">£2.1T</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Predictions */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Recent Data with Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Open</th>
                  <th className="text-left py-3 px-4">High</th>
                  <th className="text-left py-3 px-4">Low</th>
                  <th className="text-left py-3 px-4">Close</th>
                  <th className="text-left py-3 px-4">Volume</th>
                  <th className="text-left py-3 px-4">VQC Signal</th>
                </tr>
              </thead>
              <tbody>
                {marketData.slice(-10).map((data, index) => (
                  <tr key={index} className="border-b border-border/25 hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">
                      {new Date(data.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">£{data.open.toFixed(2)}</td>
                    <td className="py-3 px-4 text-accent">£{data.high.toFixed(2)}</td>
                    <td className="py-3 px-4 text-destructive">£{data.low.toFixed(2)}</td>
                    <td className="py-3 px-4 font-semibold">£{data.close.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm">
                      {(data.volume / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={`text-xs ${
                          data.prediction === 'BUY'
                            ? 'bg-primary text-primary-foreground'
                            : data.prediction === 'SELL'
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {data.prediction}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketDataPage;