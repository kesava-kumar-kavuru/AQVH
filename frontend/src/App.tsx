import Forecast from "./pages/Forecast";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
// Import the useSidebar hook
import { SidebarProvider, SidebarTrigger, useSidebar } from "./components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "./components/app-sidebar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import PredictionsPage from "./pages/PredictionsPage";
import VQCAnalysisPage from "./pages/VQCAnalysisPage";
import MarketDataPage from "./pages/MarketDataPage";
import ComparisonPage from "./pages/Comparison";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LiveTradingPage from "./pages/LiveTradingPage";

const queryClient = new QueryClient();

// --- CORRECTED DASHBOARD LAYOUT ---
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // 1. Get the sidebar's state using the hook.
  // This now works because SidebarProvider is wrapping the Routes in App.
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      {/* 2. Apply a dynamic margin to this content wrapper div. */}
      {/* This pushes the content to the right of the sidebar. */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-12' : 'md:ml-64'}`}>
        <header className="h-12 flex items-center border-b border-border/40 bg-background/95 backdrop-blur px-4">
          <SidebarTrigger className="hover:bg-muted/50" />
          <div className="ml-4 flex items-center space-x-3">
            <div className="w-6 h-6 gradient-quantum rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <span className="font-semibold gradient-quantum bg-clip-text text-transparent">
              QuantumTrader ML
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6"> {/* Added padding for better spacing */}
          {children}
        </main>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* 3. The Provider is moved here to wrap all routes */}
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/original" element={<Index />} />
            
            {/* These routes now correctly render inside the provider */}
            <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
            <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
            <Route path="/predictions" element={<DashboardLayout><PredictionsPage /></DashboardLayout>} />
            <Route path="/vqc-analysis" element={<DashboardLayout><VQCAnalysisPage /></DashboardLayout>} />
            <Route path="/market-data" element={<DashboardLayout><MarketDataPage /></DashboardLayout>} />
            <Route path="/comparison" element={<DashboardLayout><ComparisonPage /></DashboardLayout>} />
            <Route path="/live-trading" element={<DashboardLayout><LiveTradingPage /></DashboardLayout>} />
            <Route path="/forecast" element={<DashboardLayout><Forecast /></DashboardLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
