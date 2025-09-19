import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import heroImage from "../assets/quantum-hero.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Quantum Computing Financial Analysis"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <Badge className="mb-6 quantum-glow">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-quantum-pulse"></div>
            Quantum Machine Learning • FTSE 100 Analysis
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-quantum bg-clip-text text-transparent">
              Quantum-Powered
            </span>
            <br />
            <span className="text-foreground">Market Prediction</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Leveraging Variational Quantum Classifiers (VQC) to predict FTSE 100 market direction 
            with unprecedented accuracy. Experience the future of financial analysis through 
            quantum machine learning.
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Quantum Circuit Optimization</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Real-time FTSE 100 Data</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>87.3% Prediction Accuracy</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="text-lg px-8 btn-quantum">
              Explore Dashboard
            </Button>
            <Button className="text-lg px-8 btn-neural">
              View Quantum Model
            </Button>
            <Button className="text-lg px-8 btn-financial">
              Download Results
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Quantum Particles */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-primary rounded-full animate-quantum-pulse opacity-60"></div>
      <div className="absolute top-40 right-40 w-2 h-2 bg-secondary rounded-full animate-quantum-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-60 right-60 w-3 h-3 bg-accent rounded-full animate-quantum-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
    </section>
  );
}