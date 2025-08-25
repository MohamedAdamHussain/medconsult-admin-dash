
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
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
import Patients from "./pages/Patients";
import AccountSettings from "./pages/AccountSettings";
import MedicalQuestions from "./pages/MedicalQuestions";
import Appointments from "./pages/Appointments";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import Subscriptions from "./pages/Subscriptions";
import { useState } from "react";

const App = () => {
  // Create a new QueryClient instance within the component
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/admins" element={
                <ProtectedRoute>
                  <Admins />
                </ProtectedRoute>
              } />
              <Route path="/doctor-applications" element={
                <ProtectedRoute>
                  <DoctorApplications />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/financial" element={
                <ProtectedRoute>
                  <Financial />
                </ProtectedRoute>
              } />
              <Route path="/doctors" element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              } />
              <Route path="/patients" element={
                <ProtectedRoute>
                  <Patients />
                </ProtectedRoute>
              } />
              <Route path="/complaints" element={
                <ProtectedRoute>
                  <Complaints />
                </ProtectedRoute>
              } />
              {/* <Route path="/charities" element={
                <ProtectedRoute>
                  <Charities />
                </ProtectedRoute>
              } /> */}
              <Route path="/specialties" element={
                <ProtectedRoute>
                  <Specialties />
                </ProtectedRoute>
              } />
              <Route path="/gallery" element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              } />
              <Route path="/kpi" element={
                <ProtectedRoute>
                  <KPI />
                </ProtectedRoute>
              } />
              <Route path="/activity-log" element={
                <ProtectedRoute>
                  <ActivityLog />
                </ProtectedRoute>
              } />
              <Route path="/account-settings" element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              } />
              <Route path="/medical-questions" element={
                <ProtectedRoute>
                  <MedicalQuestions />
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              } />
                <Route path="/subscription-plans" element={
                <ProtectedRoute>
                  <SubscriptionPlans />
                </ProtectedRoute>
              } />
              <Route path="/subscriptions" element={
                <ProtectedRoute>
                  <Subscriptions />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;



