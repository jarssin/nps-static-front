import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, HashRouter, useNavigate } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import NPSSurveyCsat from './components/CSATSurvey';
import { useEffect } from 'react';
import NPSSurvey from './components/NPSSurvey';

const queryClient = new QueryClient();

const RedirectByQueryParam = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const surveyType = params.get('surveyType');
    if (surveyType === 'csat') {
      navigate('/csat', { replace: true });
    }
  }, [navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <RedirectByQueryParam />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/nps" element={<NPSSurvey />} />
          <Route path="/csat" element={<NPSSurveyCsat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
