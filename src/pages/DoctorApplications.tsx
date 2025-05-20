
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  Search,
  Filter,
  Check,
  X,
  MessageSquare,
  FileText,
  User
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Sample data
const applications = [
  {
    id: 1,
    name: 'د. أحمد محمد',
    specialty: 'باطنية',
    city: 'الرياض',
    status: 'new' as const,
    date: '2025-05-15',
    documents: {
      certificate: 'شهادة تخصص',
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة هوية',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'ahmed@example.com',
    }
  },
  {
    id: 2,
    name: 'د. سارة علي',
    specialty: 'جلدية',
    city: 'جدة',
    status: 'pending' as const,
    date: '2025-05-10',
    documents: {
      certificate: 'شهادة تخصص',
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة هوية',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'sara@example.com',
    }
  },
  {
    id: 3,
    name: 'د. محمد خالد',
    specialty: 'عظام',
    city: 'الدمام',
    status: 'rejected' as const,
    date: '2025-05-05',
    documents: {
      certificate: 'شهادة تخصص',
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة هوية',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'mohamed@example.com',
    }
  },
  {
    id: 4,
    name: 'د. نورة سعد',
    specialty: 'أطفال',
    city: 'الرياض',
    status: 'approved' as const,
    date: '2025-05-01',
    documents: {
      certificate: 'شهادة تخصص',
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة هوية',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'nora@example.com',
    }
  },
  {
    id: 5,
    name: 'د. فيصل عبدالله',
    specialty: 'نفسية',
    city: 'مكة',
    status: 'new' as const,
    date: '2025-05-18',
    documents: {
      certificate: 'شهادة تخصص',
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة هوية',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'faisal@example.com',
    }
  },
];

const DoctorApplications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<typeof applications[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredApplications = applications.filter(app => 
    app.name.includes(searchQuery) || 
    app.specialty.includes(searchQuery) || 
    app.city.includes(searchQuery)
  );

  const handleViewDetails = (app: typeof applications[0]) => {
    setSelectedApplication(app);
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">طلبات تسجيل الأطباء</h1>
        <p className="text-gray-500 mt-1 text-right">عرض ومراجعة طلبات تسجيل الأطباء الجدد</p>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
        <div className="flex-1 relative">
          <Label htmlFor="search" className="block mb-2 text-right">بحث</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="ابحث بالاسم، التخصص، أو المدينة"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-right"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={18} />
          <span>تصفية</span>
        </Button>
      </div>
      
      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <Card key={app.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center">
              <CardContent className="flex-1 p-6">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-3 sm:mb-0 text-right">
                    <h3 className="text-lg font-semibold">{app.name}</h3>
                    <p className="text-gray-500">{app.specialty} | {app.city}</p>
                    <p className="text-sm text-gray-400">تاريخ التقديم: {app.date}</p>
                  </div>
                  
                  <div className="flex items-start justify-end">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              </CardContent>
              
              <div className="p-4 md:p-6 border-t md:border-t-0 md:border-r border-gray-100 flex justify-end">
                <Button 
                  variant="outline" 
                  className="min-w-[120px]"
                  onClick={() => handleViewDetails(app)}
                >
                  عرض التفاصيل
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl text-right">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedApplication?.name}</DialogTitle>
            <DialogDescription>
              {selectedApplication?.specialty} | {selectedApplication?.city}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Doctor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User size={18} />
                  <span>معلومات الطبيب</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-500">البريد الإلكتروني</Label>
                    <p>{selectedApplication?.contacts.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">رقم الهاتف</Label>
                    <p>{selectedApplication?.contacts.phone}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">تخصص</Label>
                    <p>{selectedApplication?.specialty}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">المدينة</Label>
                    <p>{selectedApplication?.city}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={18} />
                  <span>المستندات</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md flex justify-between items-center">
                    <div className="text-sm font-medium">شهادة التخصص</div>
                    <Button variant="outline" size="sm">عرض</Button>
                  </div>
                  <div className="p-3 border rounded-md flex justify-between items-center">
                    <div className="text-sm font-medium">ترخيص مزاولة المهنة</div>
                    <Button variant="outline" size="sm">عرض</Button>
                  </div>
                  <div className="p-3 border rounded-md flex justify-between items-center">
                    <div className="text-sm font-medium">بطاقة الهوية</div>
                    <Button variant="outline" size="sm">عرض</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-end">
            <Button variant="destructive" className="flex items-center gap-2">
              <X size={16} />
              <span>رفض</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>طلب تعديل</span>
            </Button>
            <Button className="flex items-center gap-2">
              <Check size={16} />
              <span>قبول</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DoctorApplications;
