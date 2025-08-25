
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Search,
  Filter,
  Calendar,
  BarChart2,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import StatsCard from '@/components/dashboard/StatsCard';
import DashboardChart from '@/components/dashboard/DashboardChart';

// Sample financial data
const financialData = [
  {
    id: 1,
    doctor: 'د. أحمد محمد',
    specialty: 'باطنية',
    consultations: 45,
    commission: '15%',
    amount: 3600,
    status: 'paid',
    date: '2025-05-10',
  },
  {
    id: 2,
    doctor: 'د. سارة علي',
    specialty: 'جلدية',
    consultations: 38,
    commission: '15%',
    amount: 3040,
    status: 'pending',
    date: '2025-05-15',
  },
  {
    id: 3,
    doctor: 'د. محمد خالد',
    specialty: 'عظام',
    consultations: 32,
    commission: '15%',
    amount: 2560,
    status: 'paid',
    date: '2025-04-25',
  },
  {
    id: 4,
    doctor: 'د. نورة سعد',
    specialty: 'أطفال',
    consultations: 55,
    commission: '15%',
    amount: 4400,
    status: 'pending',
    date: '2025-05-18',
  },
  {
    id: 5,
    doctor: 'د. فيصل عبدالله',
    specialty: 'نفسية',
    consultations: 27,
    commission: '15%',
    amount: 2160,
    status: 'pending',
    date: '2025-05-17',
  },
];

// Chart data
const monthlyRevenueData = [
  { name: 'يناير', value: 45000 },
  { name: 'فبراير', value: 52000 },
  { name: 'مارس', value: 48000 },
  { name: 'أبريل', value: 61000 },
  { name: 'مايو', value: 58000 },
];

const specialtyRevenueData = [
  { name: 'باطنية', value: 25, color: '#007BFF' },
  { name: 'جلدية', value: 18, color: '#28a745' },
  { name: 'عظام', value: 15, color: '#ffc107' },
  { name: 'أطفال', value: 22, color: '#6c757d' },
  { name: 'نفسية', value: 20, color: '#dc3545' },
];

const Financial = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredData = financialData.filter(item => {
    const matchesSearch = 
      item.doctor.includes(searchQuery) || 
      item.specialty.includes(searchQuery);
    
    const matchesStatus = 
      statusFilter === 'all' || 
      item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = financialData.reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = financialData
    .filter(item => item.status === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = financialData
    .filter(item => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">الحسابات المالية</h1>
        <p className="text-gray-500 mt-1 text-right">إدارة ومتابعة الحسابات المالية للأطباء</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="إجمالي الإيرادات" 
          value={`${totalRevenue.toLocaleString()} ليرة`} 
          icon={<DollarSign className="h-6 w-6" />} 
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard 
          title="المبالغ المستحقة للمنصة" 
          value={`${pendingAmount.toLocaleString()} ليرة`} 
          icon={<ArrowDown className="h-6 w-6" />} 
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard 
          title="المبالغ المدفوعة للأطباء" 
          value={`${paidAmount.toLocaleString()} ليرة`} 
          icon={<ArrowUp className="h-6 w-6" />} 
          trend={{ value: 15, isPositive: true }}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DashboardChart 
          title="الإيرادات الشهرية" 
          type="line" 
          data={monthlyRevenueData} 
        />
        <DashboardChart 
          title="نسبة الإيرادات حسب التخصص" 
          type="pie" 
          data={specialtyRevenueData} 
          colors={['#007BFF', '#28a745', '#ffc107', '#6c757d', '#dc3545']}
        />
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-6">
        <div className="w-full sm:max-w-xs relative">
          <Input
            placeholder="بحث باسم الطبيب أو التخصص"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-right"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="text-right min-w-[150px]">
              <SelectValue placeholder="حالة الدفع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="pending">قيد الدفع</SelectItem>
              <SelectItem value="paid">تم الدفع</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>التاريخ</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            <span>تصفية</span>
          </Button>
        </div>
      </div>
      
      {/* Financial Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <BarChart2 size={20} />
            <span>سجل الحسابات المالية</span>
          </CardTitle>
          <CardDescription className="text-right">عرض كافة المعاملات المالية للأطباء</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">الطبيب</TableHead>
                <TableHead className="text-right">التخصص</TableHead>
                <TableHead className="text-center">عدد الاستشارات</TableHead>
                <TableHead className="text-center">نسبة العمولة</TableHead>
                <TableHead className="text-center">المبلغ المستحق</TableHead>
                <TableHead className="text-center">تاريخ الإضافة</TableHead>
                <TableHead className="text-center">حالة الدفع</TableHead>
                {/* <TableHead className="text-center">الإجراءات</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="font-medium">{item.doctor}</TableCell>
                  <TableCell>{item.specialty}</TableCell>
                  <TableCell className="text-center">{item.consultations}</TableCell>
                  <TableCell className="text-center">{item.commission}</TableCell>
                  <TableCell className="text-center font-semibold">{item.amount.toLocaleString()} ريال</TableCell>
                  <TableCell className="text-center">{item.date}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status === 'paid' ? 'تم الدفع' : 'قيد الدفع'}
                    </span>
                  </TableCell>
                  {/* <TableCell>
                    <div className="flex justify-center">
                      <Button 
                        size="sm" 
                        variant={item.status === 'paid' ? 'outline' : 'default'}
                        disabled={item.status === 'paid'}
                      >
                        {item.status === 'paid' ? 'تم الدفع' : 'تأكيد الدفع'}
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Financial;
