import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Brain,
  Target,
  Calendar
} from "lucide-react";
import { fetchPredictions, type PredictionData } from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PredictionsPage = () => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPredictions = async () => {
    try {
      setRefreshing(true);
      const data = await fetchPredictions();
      setPredictions(data);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPredictions();
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

  const chartData = {
    labels: predictions.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Actual Price',
        data: predictions.map(p => p.actual),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      },
      {
        label: 'VQC Prediction',
        data: predictions.map(p => p.vqc_prediction),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        borderDash: [5, 5],
      },
      {
        label: 'SVM Prediction',
        data: predictions.map(p => p.svm_prediction),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        borderDash: [10, 5],
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
        text: 'Predictions vs Actual FTSE 100 Prices',
        color: 'hsl(210 100% 95%)'
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'hsl(210 20% 65%)',
          callback: function(value: any) {
            return '£' + value.toFixed(0);
          }
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


  const latestPrediction = predictions && predictions.length > 0 ? predictions[predictions.length - 1] : null;
  const accuracy = predictions && predictions.length > 0
    ? predictions.reduce((acc, pred) => {
        if (pred.actual != null && pred.vqc_prediction != null && pred.actual !== 0) {
          const vqcError = Math.abs(pred.actual - pred.vqc_prediction) / pred.actual;
          return acc + (1 - vqcError);
        }
        return acc;
      }, 0) / predictions.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-quantum bg-clip-text text-transparent">
            Predictions
          </h1>
          <p className="text-muted-foreground">
            VQC and SVM market predictions analysis
          </p>
        </div>
        <Button 
          onClick={loadPredictions} 
          disabled={refreshing}
          className="hover:border-primary/50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-border/50 quantum-glow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-primary" />
              Latest VQC Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{latestPrediction && latestPrediction.vqc_prediction != null ? latestPrediction.vqc_prediction.toFixed(2) : '--'}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                className={`text-xs ${latestPrediction?.signal === 'BUY' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
              >
                {latestPrediction?.signal === 'BUY' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {latestPrediction?.signal}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {latestPrediction && latestPrediction.confidence != null ? (latestPrediction.confidence * 100).toFixed(1) : '--'}% confidence
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-accent" />
              Prediction Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {accuracy ? (accuracy * 100).toFixed(1) : '--'}%
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Average accuracy over {predictions.length} predictions
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-secondary" />
              Next Update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Market Close
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Predictions updated daily at 16:30 GMT
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Chart */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Historical Predictions vs Actual Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={chartData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Predictions Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actual Price</th>
                  <th className="text-left py-3 px-4">VQC Prediction</th>
                  <th className="text-left py-3 px-4">SVM Prediction</th>
                  <th className="text-left py-3 px-4">Signal</th>
                  <th className="text-left py-3 px-4">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred, index) => (
                  <tr key={index} className="border-b border-border/25 hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">
                      {new Date(pred.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      £{pred.actual != null ? pred.actual.toFixed(2) : '--'}
                    </td>
                    <td className="py-3 px-4 text-primary font-medium">
                      £{pred.vqc_prediction != null ? pred.vqc_prediction.toFixed(2) : '--'}
                    </td>
                    <td className="py-3 px-4 text-accent font-medium">
                      £{pred.svm_prediction != null ? pred.svm_prediction.toFixed(2) : '--'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        className={`text-xs ${pred.signal === 'BUY' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                      >
                        {pred.signal}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {pred.confidence != null ? (pred.confidence * 100).toFixed(1) : '--'}%
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

export default PredictionsPage;