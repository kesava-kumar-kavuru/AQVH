import { MetricCard } from "./ui/metric-card";
import { QuantumCircuit } from "./quantum-circuit";
import { MarketChart } from "./market-chart";
import { Badge } from "./ui/badge";
import { TrendingUp, Brain, Target, BarChart3 } from "lucide-react";

export function Dashboard() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4">
          Real-time Analytics Dashboard
        </Badge>
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
          <span className="gradient-neural bg-clip-text text-transparent">
            Quantum Intelligence
          </span>{" "}
          <span className="text-foreground">in Action</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Monitor your quantum machine learning model's performance with real-time 
          FTSE 100 predictions and comprehensive analytics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MetricCard
          title="Model Accuracy"
          value="87.3%"
          change="+2.1% from last week"
          trend="up"
          icon={<Target className="h-4 w-4" />}
        />
        <MetricCard
          title="Prediction Confidence"
          value="94.2%"
          change="High reliability"
          trend="up"
          icon={<Brain className="h-4 w-4" />}
        />
        <MetricCard
          title="Current FTSE 100"
          value="7,910.45"
          change="+60.23 (+0.76%)"
          trend="up"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Daily Predictions"
          value="156"
          change="Processing live data"
          trend="neutral"
          icon={<BarChart3 className="h-4 w-4" />}
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Market Chart */}
        <div className="lg:col-span-1">
          <MarketChart />
        </div>

        {/* Quantum Circuit */}
        <div className="lg:col-span-1">
          <QuantumCircuit />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/40 rounded-lg p-6 quantum-glow">
          <h3 className="text-lg font-semibold mb-4 gradient-quantum bg-clip-text text-transparent">
            Training Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Training Loss</span>
              <span className="text-sm font-medium">0.142</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Validation Loss</span>
              <span className="text-sm font-medium">0.156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Epochs</span>
              <span className="text-sm font-medium">250</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Learning Rate</span>
              <span className="text-sm font-medium">0.001</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-lg p-6 quantum-glow">
          <h3 className="text-lg font-semibold mb-4 gradient-financial bg-clip-text text-transparent">
            Market Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Volatility (30d)</span>
              <span className="text-sm font-medium">12.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
              <span className="text-sm font-medium">1.84</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Max Drawdown</span>
              <span className="text-sm font-medium">-4.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Win Rate</span>
              <span className="text-sm font-medium">73.4%</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-lg p-6 quantum-glow">
          <h3 className="text-lg font-semibold mb-4 gradient-neural bg-clip-text text-transparent">
            Quantum Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Circuit Fidelity</span>
              <span className="text-sm font-medium">98.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Entanglement</span>
              <span className="text-sm font-medium">High</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Gate Count</span>
              <span className="text-sm font-medium">64</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Quantum Volume</span>
              <span className="text-sm font-medium">16</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}