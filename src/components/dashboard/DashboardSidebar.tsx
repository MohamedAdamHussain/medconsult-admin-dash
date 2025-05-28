
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  User, 
  FileText, 
  Bell, 
  Shield, 
  Archive, 
  FileBarChart, 
  GalleryHorizontal, 
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: 'الرئيسية', href: '/', icon: Home },
  { name: 'إدارة الأطباء', href: '/doctors', icon: Users },
  { name: 'إدارة المرضى', href: '/patients', icon: User },
  { name: 'طلبات تسجيل الأطباء', href: '/doctor-applications', icon: FileText },
  { name: 'الإشعارات', href: '/notifications', icon: Bell },
  { name: 'الشكاوى', href: '/complaints', icon: Shield },
  { name: 'المشرفين', href: '/admins', icon: Users },
  { name: 'الجمعيات الخيرية', href: '/charities', icon: Archive },
  { name: 'التخصصات الطبية', href: '/specialties', icon: FileBarChart },
  { name: 'إدارة الـ Gallery', href: '/gallery', icon: GalleryHorizontal },
  { name: 'الحسابات المالية', href: '/financial', icon: DollarSign },
  { name: 'إدارة الحسابات', href: '/account-settings', icon: Settings },
];

const DashboardSidebar = ({ isOpen, setIsOpen }: DashboardSidebarProps) => {
  const location = useLocation();
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar fixed md:relative inset-y-0 right-0 z-40 flex flex-col h-full w-64 transition-transform duration-300 ease-in-out",
          !isOpen && "translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h2 className={cn("text-sidebar-foreground font-bold text-lg", !isOpen && "md:hidden")}>
            {isOpen ? "منصة MedConsult" : ""}
          </h2>
          
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-sidebar-foreground md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-sidebar-foreground hidden md:flex"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1 text-right">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "sidebar-link",
                location.pathname === item.href && "active",
                !isOpen && "md:justify-center"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className={cn("flex-1", !isOpen && "md:hidden")}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center", !isOpen && "md:justify-center")}>
            <div className="w-8 h-8 rounded-full bg-sidebar-foreground flex items-center justify-center text-sidebar">
              <span className="font-bold">A</span>
            </div>
            <div className={cn("mr-3", !isOpen && "md:hidden")}>
              <p className="text-sm font-medium text-sidebar-foreground">مدير النظام</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
