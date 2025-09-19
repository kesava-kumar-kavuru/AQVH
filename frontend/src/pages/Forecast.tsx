import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import ForecastChart from "../components/ForecastChart";
import CompanyMetrics from "../components/CompanyMetrics";
import { companies, generateForecastData } from "../lib/mockData";

const Forecast = () => {
  const [selectedCompany, setSelectedCompany] = useState("AAPL");
  
  const currentCompany = companies.find(c => c.symbol === selectedCompany);
  const forecastData = generateForecastData(selectedCompany);
  
  const priceChange = currentCompany ? currentCompany.currentPrice - currentCompany.previousClose : 0;
  const changePercent = currentCompany ? (priceChange / currentCompany.previousClose) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Quantum Market Predictor
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Variational Quantum Circuit
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Company Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Market Forecast Dashboard</h2>
              <p className="text-muted-foreground">Select a company to view quantum-powered predictions</p>
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-64 bg-card border-border">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.symbol} value={company.symbol}>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{company.symbol}</span>
                      <span className="text-muted-foreground">{company.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {currentCompany && (
          <>
            {/* Company Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-card quantum-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-foreground">
                        {currentCompany.name}
                      </CardTitle>
                      <p className="text-muted-foreground">{currentCompany.symbol} • {currentCompany.sector}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-foreground">
                        ${currentCompany.currentPrice.toFixed(2)}
                      </div>
                      <div className={`flex items-center space-x-1 ${
                        priceChange >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {priceChange >= 0 ? 
                          <TrendingUp className="h-4 w-4" /> : 
                          <TrendingDown className="h-4 w-4" />
                        }
                        <span className="font-medium">
                          {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <CompanyMetrics company={currentCompany} />
            </div>

            {/* Forecast Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-card quantum-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Quantum Forecast Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ForecastChart data={forecastData} companyName={currentCompany.name} />
                </CardContent>
              </Card>

              {/* Prediction Insights */}
              <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 shadow-card quantum-glow">
                <CardHeader>
                  <CardTitle className="text-lg">Quantum Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 animate-quantum-pulse">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-medium text-sm">30-Day Prediction</span>
                    </div>
                    <div className="text-2xl font-bold text-success">
                      +{((Math.random() * 15) + 5).toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Expected growth</p>
                  </div>

                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 animate-neural-glow">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span className="font-medium text-sm">Confidence Level</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {(85 + Math.random() * 10).toFixed(0)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Quantum certainty</p>
                  </div>

                  <div className="p-4 rounded-lg bg-warning/5 border border-warning/20 animate-data-flow">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-warning"></div>
                      <span className="font-medium text-sm">Risk Factor</span>
                    </div>
                    <div className="text-2xl font-bold text-warning">
                      {(['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)])}
                    </div>
                    <p className="text-xs text-muted-foreground">Market volatility</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Forecast;
