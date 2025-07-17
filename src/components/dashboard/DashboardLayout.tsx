
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
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
          {/* شعار المنصة */}
          <div className="flex items-center gap-2">
            {/* يمكنك استبدال النص بصورة شعار لاحقًا */}
            <span className="font-bold text-xl text-primary">منصة مد كونسلت</span>
          </div>
          <div className="md:flex-1 flex justify-end">
            <GlobalSearch />
          </div>
        </div>

        {/* Content */}
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
