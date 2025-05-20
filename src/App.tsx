
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admins from "./pages/Admins";
import DoctorApplications from "./pages/DoctorApplications";
import Notifications from "./pages/Notifications";
import Financial from "./pages/Financial";
import NotFound from "./pages/NotFound";
import Specialties from "./pages/Specialties";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/doctor-applications" element={<DoctorApplications />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/doctors" element={<Index />} />
          <Route path="/patients" element={<Index />} />
          <Route path="/complaints" element={<Index />} />
          <Route path="/charities" element={<Index />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/gallery" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
