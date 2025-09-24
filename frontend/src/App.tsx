import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { Dashboard } from "./pages/Dashboard";
import { Issues } from "./pages/Issues";
import { ReportIssue } from "./pages/ReportIssue";
import { Campaigns } from "./pages/Campaigns";
import { Analytics } from "./pages/Analytics";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { IssueDetails } from "./pages/IssueDetails";
import { Leaderboard } from "./pages/Leaderboard"; // Import the new page
import { ManageAccount } from "./pages/Manage";

const queryClient = new QueryClient();

const App = () => {
  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('accessToken') !== null;
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              } />
            </Route>
            
            <Route path="/issues" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Issues />} />
            </Route>
            <Route path="/issues/:issueId" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<IssueDetails />} />
            </Route>
            
            <Route path="/report" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<ReportIssue />} />
            </Route>
            
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Campaigns />} />
            </Route>

            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Leaderboard />} />
            </Route>
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Analytics />} />
            </Route>
            <Route path="/account" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<ManageAccount />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;



// ... (imports)
 // Import the new page

// ... (inside App component)
<BrowserRouter>
  <Routes>
    {/* ... (other routes) ... */}
    
   
    
    {/* ... (catch-all route) ... */}
  </Routes>
</BrowserRouter>