
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
  Settings,
  LogOut,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import logo from '/public/icons8-dashboard-layout-32.png';

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: 'الرئيسية', href: '/', icon: Home },
  { name: 'إدارة الأطباء', href: '/doctors', icon: Users },
  { name: 'إدارة المرضى', href: '/patients', icon: User },
  { name: 'طلبات تسجيل الأطباء', href: '/doctor-applications', icon: FileText },
  { name: 'المواعيد', href: '/appointments', icon: Calendar },
  { name: 'الإشعارات', href: '/notifications', icon: Bell },
  { name: 'الشكاوى', href: '/complaints', icon: Shield },
  { name: 'المشرفين', href: '/admins', icon: Users },
  { name: 'الجمعيات الخيرية', href: '/charities', icon: Archive },
  { name: 'التخصصات الطبية', href: '/specialties', icon: FileBarChart },
  { name: 'الأسئلة الطبية', href: '/medical-questions', icon: FileText },
  { name: 'إدارة الـ Gallery', href: '/gallery', icon: GalleryHorizontal },
  { name: 'الخطط', href: '/subscription-plans', icon: Archive },
  { name: 'الاشتراكات', href: '/subscriptions', icon: Users },
  { name: 'الحسابات المالية', href: '/financial', icon: DollarSign },
  { name: 'إدارة الحسابات', href: '/account-settings', icon: Settings },
];

const dividerIndex = 5; // ضع الفاصل بعد القسم الخامس (عدّل حسب الحاجة)

const DashboardSidebar = ({ isOpen, setIsOpen }: DashboardSidebarProps) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  
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
          "bg-white/95 backdrop-blur-md border-l border-border/20 shadow-large h-full w-64 flex flex-col transition-all duration-300 overflow-y-auto", // أضفت overflow-y-auto
          !isOpen && "md:w-20 w-20"
        )}
      >
        {/* شعار واسم التطبيق */}
        <div className="flex items-center justify-center py-6 border-b border-border/20 bg-gradient-to-r from-blue-50/50 to-transparent">
          <img src={logo} alt="الشعار" className="h-8 hover:scale-110 transition-transform duration-200" />
          {isOpen && <span className="font-bold text-xl mr-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">MedConsult</span>}
        </div>
        {/* روابط التنقل + زر التوسيع/التصغير في الأسفل */}
        <div className="flex flex-col flex-1 justify-between min-h-0">
          <nav className="flex-1 p-4 space-y-2 text-right overflow-y-auto">
            {navItems.map((item, idx) => (
              <React.Fragment key={item.name}>
                {idx === dividerIndex && <hr className="my-4 border-t border-border/30" />}
                <Link
                  to={item.href}
                  className={cn(
                    "sidebar-link flex flex-row-reverse items-center rounded-xl px-4 py-3 transition-all duration-300 font-medium text-base group",
                    location.pathname === item.href
                      ? "bg-gradient-to-r from-blue-500/10 to-blue-600/5 text-blue-700 font-bold shadow-sm border border-blue-200/30"
                      : "hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent text-gray-700 hover:text-blue-600",
                    !isOpen && "md:justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5 ml-3 group-hover:scale-110 transition-transform duration-200" />
                  {isOpen && <span className="flex-1 tracking-wide">{item.name}</span>}
                </Link>
              </React.Fragment>
            ))}
          </nav>
          {/* زر تصغير/توسيع */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-4 text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200 border-t border-border/20 w-full group"
            title={isOpen ? 'تصغير' : 'توسيع'}
          >
            {isOpen ? <ChevronLeft className="group-hover:scale-110 transition-transform duration-200" /> : <ChevronRight className="group-hover:scale-110 transition-transform duration-200" />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
