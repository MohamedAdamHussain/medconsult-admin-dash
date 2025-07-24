
import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlobalSearch from './GlobalSearch';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header with Mobile Sidebar Toggle and Global Search */}
        <div className="p-6 border-b border-border/20 bg-white/80 backdrop-blur-md flex items-center justify-between shadow-sm">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden hover:scale-105 transition-transform duration-200"
          >
            <Menu className="h-4 w-4" />
          </Button>
          {/* شعار المنصة */}
          <div className="flex items-center gap-2">
            {/* يمكنك استبدال النص بصورة شعار لاحقًا */}
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight">منصة مد كونسلت</span>
          </div>
          <div className="md:flex-1 flex justify-end">
            <GlobalSearch />
          </div>
        </div>

        {/* Content */}
        <main className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
