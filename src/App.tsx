
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
import Doctors from "./pages/Doctors";
import KPI from "./pages/KPI";
import ActivityLog from "./pages/ActivityLog";
import Gallery from "./pages/Gallery";
import Charities from "./pages/Charities";
import Complaints from "./pages/Complaints";
import { useState } from "react";

const App = () => {
  // Create a new QueryClient instance within the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admins" element={<Admins />} />
            <Route path="/doctor-applications" element={<DoctorApplications />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/patients" element={<Index />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/charities" element={<Charities />} />
            <Route path="/specialties" element={<Specialties />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/kpi" element={<KPI />} />
            <Route path="/activity-log" element={<ActivityLog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
