import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export function Navigation() {
  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-quantum rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-quantum bg-clip-text text-transparent">
                QuantumTrader
              </h1>
              <p className="text-xs text-muted-foreground">ML Market Predictor</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#quantum" className="text-foreground hover:text-primary transition-colors">
              Quantum Model
            </a>
            <a href="#analysis" className="text-foreground hover:text-primary transition-colors">
              Analysis
            </a>
            <a href="#performance" className="text-foreground hover:text-primary transition-colors">
              Performance
            </a>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center space-x-3">
            <Badge className="animate-quantum-pulse">
              <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
              Live Trading
            </Badge>
            <Button>
              View Results
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}