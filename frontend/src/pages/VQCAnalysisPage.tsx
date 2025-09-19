import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { QuantumCircuit } from "../components/quantum-circuit";
import { 
  Brain, 
  Zap, 
  Activity, 
  Settings,
  Layers,
  GitBranch,
  Clock,
  AlertTriangle
} from "lucide-react";
import { fetchQuantumMetrics, type QuantumMetrics } from "../services/api";

const VQCAnalysisPage = () => {
  const [quantumMetrics, setQuantumMetrics] = useState<QuantumMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuantumData = async () => {
      try {
        const metrics = await fetchQuantumMetrics();
        setQuantumMetrics(metrics);
      } catch (error) {
        console.error('Error loading quantum metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuantumData();
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

  const architectureData = {
    inputLayer: { qubits: 8, description: "Feature encoding from normalized FTSE 100 data" },
    variationalLayers: { 
      count: 4, 
      description: "Parameterized quantum gates with trainable parameters",
      parameters: 32
    },
    entanglingLayers: { 
      count: 3, 
      description: "CNOT gates creating quantum entanglement",
      connections: 12
    },
    measurementLayer: { qubits: 3, description: "Classification output measurement" }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-quantum bg-clip-text text-transparent">
            VQC Analysis
          </h1>
          <p className="text-muted-foreground">
            Variational Quantum Classifier architecture and performance
          </p>
        </div>
        <Badge className="animate-quantum-pulse">
          <Zap className="h-3 w-3 mr-1" />
          Quantum Active
        </Badge>
      </div>

      {/* Quantum Circuit Visualization */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            VQC Circuit Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuantumCircuit />
        </CardContent>
      </Card>

      {/* Quantum Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/50 quantum-glow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Layers className="h-4 w-4 text-primary" />
              Circuit Depth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {quantumMetrics?.circuit_depth}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              layers
            </div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-secondary" />
              Quantum Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {quantumMetrics?.quantum_volume}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              IBM metric
            </div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4 text-accent" />
              Gate Fidelity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {((quantumMetrics?.gate_fidelity || 0) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              accuracy
            </div>
            <Progress value={99.5} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-400" />
              Coherence Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {quantumMetrics?.coherence_time}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              microseconds
            </div>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Architecture Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              Circuit Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-2 border-primary/30 pl-4">
              <h4 className="font-semibold text-primary">Input Layer</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {architectureData.inputLayer.description}
              </p>
              <div className="text-xs text-muted-foreground">
                Qubits: {architectureData.inputLayer.qubits}
              </div>
            </div>

            <div className="border-l-2 border-secondary/30 pl-4">
              <h4 className="font-semibold text-secondary">Variational Layers</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {architectureData.variationalLayers.description}
              </p>
              <div className="text-xs text-muted-foreground">
                Layers: {architectureData.variationalLayers.count} • 
                Parameters: {architectureData.variationalLayers.parameters}
              </div>
            </div>

            <div className="border-l-2 border-accent/30 pl-4">
              <h4 className="font-semibold text-accent">Entangling Layers</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {architectureData.entanglingLayers.description}
              </p>
              <div className="text-xs text-muted-foreground">
                Layers: {architectureData.entanglingLayers.count} • 
                Connections: {architectureData.entanglingLayers.connections}
              </div>
            </div>

            <div className="border-l-2 border-orange-400/30 pl-4">
              <h4 className="font-semibold text-orange-400">Measurement Layer</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {architectureData.measurementLayer.description}
              </p>
              <div className="text-xs text-muted-foreground">
                Output Qubits: {architectureData.measurementLayer.qubits}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Error Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Gate Error Rate</span>
                <span className="font-semibold text-destructive">
                  {((quantumMetrics?.error_rate || 0) * 100).toFixed(2)}%
                </span>
              </div>
              <Progress value={(quantumMetrics?.error_rate || 0) * 100 * 20} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Measurement Error</span>
                <span className="font-semibold text-orange-400">0.12%</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Decoherence Impact</span>
                <span className="font-semibold text-yellow-400">0.08%</span>
              </div>
              <Progress value={8} className="h-2" />
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="text-sm text-muted-foreground">
                <strong>Error Mitigation:</strong> Zero-noise extrapolation and 
                readout error correction applied to improve accuracy.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Information */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Training Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Dataset</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Source: yfinance FTSE 100</div>
                <div>Period: 2020-2024</div>
                <div>Features: 16 technical indicators</div>
                <div>Samples: 1,247 trading days</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Optimization</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Algorithm: COBYLA</div>
                <div>Iterations: 500</div>
                <div>Learning Rate: 0.01</div>
                <div>Convergence: 10⁻⁶</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Hardware</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Backend: IBM Quantum</div>
                <div>Processor: ibmq_qasm_simulator</div>
                <div>Shots: 8,192 per circuit</div>
                <div>Noise Model: Enabled</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Performance</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Training Time: 2.3 hours</div>
                <div>Inference: 45ms per prediction</div>
                <div>Memory Usage: 1.2 GB</div>
                <div>Final Loss: 0.0034</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VQCAnalysisPage;