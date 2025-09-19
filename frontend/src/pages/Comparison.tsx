import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  Brain, 
  Cpu, 
  Trophy,
  TrendingUp,
  Target,
  Activity,
  Zap
} from "lucide-react";
import { fetchModelAccuracies, fetchPredictions } from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const ComparisonPage = () => {
  const [modelAccuracies, setModelAccuracies] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComparisonData = async () => {
      try {
        const [accuracies, preds] = await Promise.all([
          fetchModelAccuracies(),
          fetchPredictions()
        ]);
        setModelAccuracies(accuracies);
        setPredictions(preds);
      } catch (error) {
        console.error('Error loading comparison data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComparisonData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const vqcModel = modelAccuracies.find(m => m.model.includes('VQC'));
  const svmModel = modelAccuracies.find(m => m.model.includes('SVM'));

  // Accuracy comparison chart
  const accuracyComparisonData = {
    labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score'],
    datasets: [
      {
        label: 'VQC (Quantum)',
        data: [vqcModel?.accuracy, vqcModel?.precision, vqcModel?.recall, vqcModel?.f1Score],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'SVM (Classical)',
        data: [svmModel?.accuracy, svmModel?.precision, svmModel?.recall, svmModel?.f1Score],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Prediction accuracy over time
  const predictionAccuracyData = {
    labels: predictions.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'VQC Error Rate',
        data: predictions.map(p => Math.abs(p.actual - p.vqc_prediction) / p.actual * 100),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        fill: false,
      },
      {
        label: 'SVM Error Rate',
        data: predictions.map(p => Math.abs(p.actual - p.svm_prediction) / p.actual * 100),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        fill: false,
      },
    ],
  };

  // Radar chart for comprehensive comparison
  const radarData = {
    labels: ['Accuracy', 'Speed', 'Interpretability', 'Scalability', 'Robustness'],
    datasets: [
      {
        label: 'VQC',
        data: [87, 75, 60, 85, 90],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: 'rgba(139, 92, 246, 1)',
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(139, 92, 246, 1)',
      },
      {
        label: 'SVM',
        data: [82, 95, 85, 70, 75],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
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

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'hsl(210 100% 95%)'
        }
      },
    },
    scales: {
      r: {
        angleLines: {
          color: 'hsl(225 15% 20%)'
        },
        grid: {
          color: 'hsl(225 15% 20%)'
        },
        pointLabels: {
          color: 'hsl(210 20% 65%)'
        },
        ticks: {
          color: 'hsl(210 20% 65%)',
          backdropColor: 'transparent'
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
            SVM vs VQC Comparison
          </h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of classical vs quantum machine learning approaches
          </p>
        </div>
        <Badge color="secondary" className="animate-quantum-pulse">
          <Trophy className="h-3 w-3 mr-1" />
          Performance Analysis
        </Badge>
      </div>

      {/* Head-to-Head Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50 quantum-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              VQC (Quantum)
            </CardTitle>
            <Badge className="w-fit border-primary/30 text-primary">
              Variational Quantum Classifier
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Accuracy</span>
                <span className="font-bold text-primary text-lg">{vqcModel?.accuracy}%</span>
              </div>
              <Progress value={vqcModel?.accuracy} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div>
                <div className="text-sm text-muted-foreground">Precision</div>
                <div className="font-semibold">{vqcModel?.precision}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Recall</div>
                <div className="font-semibold">{vqcModel?.recall}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">F1 Score</div>
                <div className="font-semibold">{vqcModel?.f1Score}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Training Time</div>
                <div className="font-semibold">2.3 hours</div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h4 className="font-semibold mb-2 text-primary">Advantages</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Superior pattern recognition in high-dimensional data</li>
                <li>• Quantum entanglement captures complex relationships</li>
                <li>• Exponential speedup potential for certain problems</li>
                <li>• Noise resilience through error mitigation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-accent" />
              SVM (Classical)
            </CardTitle>
            <Badge className="w-fit border-accent/30 text-accent">
              Support Vector Machine
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Accuracy</span>
                <span className="font-bold text-accent text-lg">{svmModel?.accuracy}%</span>
              </div>
              <Progress value={svmModel?.accuracy} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div>
                <div className="text-sm text-muted-foreground">Precision</div>
                <div className="font-semibold">{svmModel?.precision}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Recall</div>
                <div className="font-semibold">{svmModel?.recall}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">F1 Score</div>
                <div className="font-semibold">{svmModel?.f1Score}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Training Time</div>
                <div className="font-semibold">45 minutes</div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h4 className="font-semibold mb-2 text-accent">Advantages</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Proven reliability and stability</li>
                <li>• Fast training and inference times</li>
                <li>• Well-understood mathematical foundation</li>
                <li>• Excellent performance on smaller datasets</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-secondary" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={accuracyComparisonData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-400" />
              Comprehensive Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Radar data={radarData} options={radarOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Error Rate Comparison */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Prediction Error Rate Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Line data={predictionAccuracyData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* Detailed Comparison Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Detailed Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-left py-3 px-4">VQC (Quantum)</th>
                  <th className="text-left py-3 px-4">SVM (Classical)</th>
                  <th className="text-left py-3 px-4">Winner</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/25">
                  <td className="py-3 px-4 font-medium">Accuracy</td>
                  <td className="py-3 px-4 text-primary font-semibold">87.3%</td>
                  <td className="py-3 px-4 text-accent font-semibold">82.1%</td>
                  <td className="py-3 px-4">
                    <Badge className="border-primary/30 text-primary">
                      <Brain className="h-3 w-3 mr-1" />
                      VQC
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-border/25">
                  <td className="py-3 px-4 font-medium">Training Speed</td>
                  <td className="py-3 px-4">2.3 hours</td>
                  <td className="py-3 px-4 text-accent font-semibold">45 minutes</td>
                  <td className="py-3 px-4">
                    <Badge className="border-accent/30 text-accent">
                      <Cpu className="h-3 w-3 mr-1" />
                      SVM
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-border/25">
                  <td className="py-3 px-4 font-medium">Inference Speed</td>
                  <td className="py-3 px-4">45ms per prediction</td>
                  <td className="py-3 px-4 text-accent font-semibold">2ms per prediction</td>
                  <td className="py-3 px-4">
                    <Badge className="border-accent/30 text-accent">
                      <Cpu className="h-3 w-3 mr-1" />
                      SVM
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-border/25">
                  <td className="py-3 px-4 font-medium">Memory Usage</td>
                  <td className="py-3 px-4">1.2 GB</td>
                  <td className="py-3 px-4 text-accent font-semibold">85 MB</td>
                  <td className="py-3 px-4">
                    <Badge className="border-accent/30 text-accent">
                      <Cpu className="h-3 w-3 mr-1" />
                      SVM
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-border/25">
                  <td className="py-3 px-4 font-medium">Scalability</td>
                  <td className="py-3 px-4 text-primary font-semibold">Exponential potential</td>
                  <td className="py-3 px-4">Polynomial scaling</td>
                  <td className="py-3 px-4">
                    <Badge className="border-primary/30 text-primary">
                      <Brain className="h-3 w-3 mr-1" />
                      VQC
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b border-border/25">
                  <td className="py-3 px-4 font-medium">Interpretability</td>
                  <td className="py-3 px-4">Circuit visualization</td>
                  <td className="py-3 px-4 text-accent font-semibold">Mathematical transparency</td>
                  <td className="py-3 px-4">
                    <Badge className="border-accent/30 text-accent">
                      <Cpu className="h-3 w-3 mr-1" />
                      SVM
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">VQC Advantages</h4>
              <p className="text-sm text-muted-foreground">
                Superior accuracy (87.3% vs 82.1%) and better handling of complex, 
                high-dimensional financial patterns through quantum entanglement.
              </p>
            </div>
            
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <h4 className="font-semibold text-accent mb-2">SVM Advantages</h4>
              <p className="text-sm text-muted-foreground">
                Faster training and inference, lower resource requirements, 
                and proven reliability for production environments.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-secondary" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">For Production Trading</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Use VQC for daily predictions where accuracy is paramount, 
                with SVM as a fast backup for real-time decisions.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Future Improvements</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hybrid quantum-classical ensemble models</li>
                <li>• Hardware optimization for faster quantum inference</li>
                <li>• Error mitigation techniques for better accuracy</li>
                <li>• Quantum advantage scaling with more qubits</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonPage;