import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MetricCard } from "../components/ui/metric-card";
import { 
  TrendingUp, 
  Activity, 
  Brain,
  BarChart3,
  Zap
} from "lucide-react";
import { fetchLiveMetrics, fetchModelAccuracies } from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

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

const DashboardPage = () => {
  const [liveMetrics, setLiveMetrics] = useState<any>(null);
  const [modelAccuracies, setModelAccuracies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [metrics, accuracies] = await Promise.all([
          fetchLiveMetrics(),
          fetchModelAccuracies()
        ]);
        setLiveMetrics(metrics);
        setModelAccuracies(accuracies);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const accuracyData = {
    labels: modelAccuracies.map(m => m.model),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: modelAccuracies.map(m => m.accuracy),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue for VQC
          'rgba(16, 185, 129, 0.8)', // Green for SVM
          'rgba(139, 92, 246, 0.8)', // Purple for IBM
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
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
      title: {
        display: true,
        text: 'Model Performance Comparison',
        color: 'hsl(210 100% 95%)'
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'hsl(210 20% 65%)'
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-quantum bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time quantum ML market analysis
          </p>
        </div>
        <Badge className="animate-quantum-pulse">
          <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
          Live Trading
        </Badge>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="FTSE 100 Price"
          value={`£${liveMetrics?.currentPrice?.toFixed(2) || '0.00'}`}
          change={liveMetrics?.dailyChange || 0}
          icon={<TrendingUp />}
        />
        
        <MetricCard
          title="Daily Volume"
          value={liveMetrics?.volume?.toLocaleString() || '0'}
          icon={<Activity />}
        />
        
        <MetricCard
          title="Volatility"
          value={`${((liveMetrics?.volatility || 0) * 100).toFixed(1)}%`}
          icon={<BarChart3 />}
        />
        
        <MetricCard
          title="VQC Prediction"
          value={liveMetrics?.nextPrediction || 'HOLD'}
          change={((liveMetrics?.confidence || 0) * 100).toFixed(2)}
          icon={<Brain />}
          className="quantum-glow"
        />
      </div>

      {/* Model Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Model Accuracies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={accuracyData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-secondary" />
              Quantum Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Circuit Depth</span>
              <span className="font-semibold">12 layers</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Quantum Volume</span>
              <span className="font-semibold">64</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gate Fidelity</span>
              <span className="font-semibold text-accent">99.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Coherence Time</span>
              <span className="font-semibold">150 μs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Error Rate</span>
              <span className="font-semibold text-destructive">0.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modelAccuracies.map((model, index) => (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {model.model.includes('Quantum') && <Zap className="h-5 w-5 text-primary" />}
                {model.model.includes('SVM') && <BarChart3 className="h-5 w-5 text-accent" />}
                {model.model.includes('IBM') && <Brain className="h-5 w-5 text-secondary" />}
                {model.model}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Accuracy</span>
                <span className="font-semibold text-primary">{model.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Precision</span>
                <span className="font-semibold">{model.precision}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Recall</span>
                <span className="font-semibold">{model.recall}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">F1 Score</span>
                <span className="font-semibold">{model.f1Score}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;