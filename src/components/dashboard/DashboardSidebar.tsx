
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
import logo from '/public/favicon.ico';

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
          "bg-white border-l shadow h-full w-64 flex flex-col transition-all duration-300",
          !isOpen && "md:w-20 w-20"
        )}
      >
        {/* شعار واسم التطبيق */}
        <div className="flex items-center justify-center py-4 border-b">
          <img src={logo} alt="الشعار" className="h-8" />
          {isOpen && <span className="font-bold text-lg mr-2 text-primary">MedConsult</span>}
        </div>
        {/* روابط التنقل */}
        <nav className="flex-1 p-2 space-y-1 text-right">
          {navItems.map((item, idx) => (
            <React.Fragment key={item.name}>
              {idx === dividerIndex && <hr className="my-2 border-t border-gray-200" />}
              <Link
                to={item.href}
                className={cn(
                  "sidebar-link flex flex-row-reverse items-center rounded-lg px-3 py-2 transition font-medium text-base",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary font-bold"
                    : "hover:bg-primary/5 text-gray-700",
                  !isOpen && "md:justify-center"
                )}
              >
                <item.icon className="h-5 w-5 ml-2" />
                {isOpen && <span className="flex-1">{item.name}</span>}
              </Link>
            </React.Fragment>
          ))}
        </nav>
        {/* زر تصغير/توسيع */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-500 hover:text-primary transition border-t"
          title={isOpen ? 'تصغير' : 'توسيع'}
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </aside>
    </>
  );
};

export default DashboardSidebar;
