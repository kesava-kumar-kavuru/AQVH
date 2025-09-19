import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface ForecastChartProps {
  data: Array<{
    date: string;
    historical: number | null;
    predicted: number | null;
    confidenceUpper: number | null;
    confidenceLower: number | null;
  }>;
  companyName: string;
}

const ForecastChart = ({ data, companyName }: ForecastChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-foreground">
                {entry.name}: ${entry.value?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-secondary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-secondary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-tertiary))" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="hsl(var(--chart-tertiary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            opacity={0.3}
          />
          
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Confidence interval */}
          <Area
            type="monotone"
            dataKey="confidenceUpper"
            stroke="none"
            fill="url(#confidenceGradient)"
            fillOpacity={0.3}
          />
          
          <Area
            type="monotone"
            dataKey="confidenceLower"
            stroke="none"
            fill="url(#confidenceGradient)"
            fillOpacity={0.3}
          />
          
          {/* Historical data */}
          <Area
            type="monotone"
            dataKey="historical"
            stroke="hsl(var(--chart-primary))"
            strokeWidth={2}
            fill="url(#historicalGradient)"
            connectNulls={false}
            name="Historical Price"
          />
          
          {/* Predicted data */}
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="hsl(var(--chart-secondary))"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#predictedGradient)"
            connectNulls={false}
            name="Quantum Prediction"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;