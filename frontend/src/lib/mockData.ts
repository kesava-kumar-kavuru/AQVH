export const companies = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 175.43,
    previousClose: 172.89,
    volume: "58.2M",
    marketCap: "2.85T",
    sector: "Technology"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    currentPrice: 338.11,
    previousClose: 335.67,
    volume: "32.1M", 
    marketCap: "2.51T",
    sector: "Technology"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    currentPrice: 139.69,
    previousClose: 138.21,
    volume: "28.9M",
    marketCap: "1.76T", 
    sector: "Technology"
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    currentPrice: 145.12,
    previousClose: 143.75,
    volume: "45.7M",
    marketCap: "1.51T",
    sector: "Consumer Discretionary"
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    currentPrice: 248.87,
    previousClose: 245.62,
    volume: "89.3M",
    marketCap: "789.2B",
    sector: "Automotive"
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    currentPrice: 317.54,
    previousClose: 314.88,
    volume: "19.8M", 
    marketCap: "808.1B",
    sector: "Technology"
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    currentPrice: 875.28,
    previousClose: 869.12,
    volume: "41.2M",
    marketCap: "2.16T",
    sector: "Technology"
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    currentPrice: 467.12,
    previousClose: 463.89,
    volume: "8.7M",
    marketCap: "207.8B", 
    sector: "Communication Services"
  },
  {
    symbol: "CRM",
    name: "Salesforce Inc.",
    currentPrice: 218.45,
    previousClose: 216.77,
    volume: "5.1M",
    marketCap: "215.6B",
    sector: "Technology"
  },
  {
    symbol: "ORCL",
    name: "Oracle Corporation", 
    currentPrice: 112.78,
    previousClose: 111.23,
    volume: "12.3M",
    marketCap: "312.4B",
    sector: "Technology"
  }
];

export const generateForecastData = (symbol: string) => {
  const company = companies.find(c => c.symbol === symbol);
  if (!company) return [];

  const data = [];
  const startPrice = company.currentPrice;
  const volatility = 0.02 + Math.random() * 0.03; // 2-5% daily volatility
  
  // Generate 30 days of historical data
  for (let i = -30; i <= 0; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const randomWalk = (Math.random() - 0.5) * volatility;
    const price = startPrice * (1 + randomWalk * (Math.abs(i) / 30));
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      historical: parseFloat(price.toFixed(2)),
      predicted: null,
      confidenceUpper: null,
      confidenceLower: null
    });
  }
  
  // Generate 30 days of predicted data
  let lastPrice = startPrice;
  for (let i = 1; i <= 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Quantum-inspired prediction with trend
    const trend = 0.001 * i; // Slight upward trend
    const quantumNoise = (Math.random() - 0.5) * volatility * 0.8;
    const predictedPrice = lastPrice * (1 + trend + quantumNoise);
    
    const confidence = volatility * lastPrice * 1.5;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      historical: null,
      predicted: parseFloat(predictedPrice.toFixed(2)),
      confidenceUpper: parseFloat((predictedPrice + confidence).toFixed(2)),
      confidenceLower: parseFloat((predictedPrice - confidence).toFixed(2))
    });
    
    lastPrice = predictedPrice;
  }
  
  return data;
};