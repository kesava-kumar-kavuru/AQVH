import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Brain, TrendingUp, Zap, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Variational Quantum Classifier",
      description: "Advanced VQC model for market prediction with 87.3% accuracy"
    },
    {
      icon: TrendingUp,
      title: "FTSE 100 Analysis",
      description: "Real-time analysis of FTSE 100 market data using yfinance"
    },
    {
      icon: Zap,
      title: "IBM Quantum Integration",
      description: "Leveraging IBM Quantum computers for enhanced predictions"
    },
    {
      icon: BarChart3,
      title: "SVM Comparison",
      description: "Side-by-side comparison with classical SVM algorithms"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Quantum Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-quantum rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">Q</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-quantum bg-clip-text text-transparent">
                  QuantumTrader ML
                </h1>
                <p className="text-sm text-muted-foreground">Quantum Market Prediction</p>
              </div>
            </div>
            <Badge className="animate-quantum-pulse">
              <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
              Quantum Active
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-6 border-primary/20 text-primary">
            Hackathon Project • FTSE 100 Classification
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-quantum bg-clip-text text-transparent">
              Quantum ML
            </span>
            <br />
            <span className="text-foreground">Market Predictor</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Revolutionary quantum machine learning approach to predict FTSE 100 market direction 
            using Variational Quantum Classifiers with 87.3% accuracy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="text-lg px-8 py-6"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button className="text-lg px-8 py-6">
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <Card className="p-6 bg-card/50 border-border/50">
              <div className="text-3xl font-bold gradient-quantum bg-clip-text text-transparent">87.3%</div>
              <div className="text-sm text-muted-foreground">VQC Accuracy</div>
            </Card>
            <Card className="p-6 bg-card/50 border-border/50">
              <div className="text-3xl font-bold gradient-financial bg-clip-text text-transparent">FTSE 100</div>
              <div className="text-sm text-muted-foreground">Market Data</div>
            </Card>
            <Card className="p-6 bg-card/50 border-border/50">
              <div className="text-3xl font-bold gradient-neural bg-clip-text text-transparent">Real-time</div>
              <div className="text-sm text-muted-foreground">Predictions</div>
            </Card>
            <Card className="p-6 bg-card/50 border-border/50">
              <div className="text-3xl font-bold text-accent">IBM Q</div>
              <div className="text-sm text-muted-foreground">Quantum Backend</div>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-card/50 border-border/50 hover:bg-card/70 transition-all duration-300">
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Technical Overview */}
        <Card className="p-8 bg-card/30 border-border/50">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Technical Architecture</h2>
            <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
              Our quantum machine learning system combines classical preprocessing with quantum 
              variational circuits to achieve superior market prediction accuracy on FTSE 100 data.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => navigate('/vqc-analysis')}
                className="hover:border-primary/50"
              >
                Explore Architecture
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default LandingPage;