import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Trash2, Search } from 'lucide-react';

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

// بيانات افتراضية للأطباء والمرضى
const doctors = [
  { id: 'd1', name: 'د. أحمد محمد' },
  { id: 'd2', name: 'د. سارة علي' },
  { id: 'd3', name: 'د. محمد أحمد' },
];
const patients = [
  { id: 'p1', name: 'خالد يوسف' },
  { id: 'p2', name: 'منى حسن' },
  { id: 'p3', name: 'سعيد علي' },
];

const initialAppointments: Appointment[] = [
  { id: 'a1', doctorId: 'd1', doctorName: 'د. أحمد محمد', patientId: 'p1', patientName: 'خالد يوسف', date: '2025-07-10T10:00', status: 'scheduled', notes: 'مراجعة دورية' },
  { id: 'a2', doctorId: 'd2', doctorName: 'د. سارة علي', patientId: 'p2', patientName: 'منى حسن', date: '2025-07-11T12:30', status: 'completed', notes: 'استشارة أولى' },
  { id: 'a3', doctorId: 'd3', doctorName: 'د. محمد أحمد', patientId: 'p3', patientName: 'سعيد علي', date: '2025-07-12T09:00', status: 'cancelled', notes: 'تم الإلغاء من قبل المريض' },
];

const statusOptions = [
  { value: 'scheduled', label: 'مجدول' },
  { value: 'completed', label: 'مكتمل' },
  { value: 'cancelled', label: 'ملغي' },
];

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [showAdd, setShowAdd] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [filterPatient, setFilterPatient] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [search, setSearch] = useState('');

  // إضافة موعد جديد
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    patientId: '',
    date: '',
    status: 'scheduled',
    notes: '',
  });

  const handleAdd = () => {
    if (!newAppointment.doctorId || !newAppointment.patientId || !newAppointment.date) return;
    const doctor = doctors.find(d => d.id === newAppointment.doctorId);
    const patient = patients.find(p => p.id === newAppointment.patientId);
    setAppointments(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        doctorId: newAppointment.doctorId,
        doctorName: doctor?.name || '',
        patientId: newAppointment.patientId,
        patientName: patient?.name || '',
        date: newAppointment.date,
        status: newAppointment.status as Appointment['status'],
        notes: newAppointment.notes,
      },
    ]);
    setShowAdd(false);
    setNewAppointment({ doctorId: '', patientId: '', date: '', status: 'scheduled', notes: '' });
  };

  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // فلترة المواعيد
  const filtered = appointments.filter(a =>
    (filterDoctor === 'all' || a.doctorId === filterDoctor) &&
    (filterPatient === 'all' || a.patientId === filterPatient) &&
    (filterStatus === 'all' || a.status === filterStatus) &&
    (!filterDate || a.date.startsWith(filterDate)) &&
    (!search || a.doctorName.includes(search) || a.patientName.includes(search) || (a.notes && a.notes.includes(search)))
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">إدارة المواعيد</h1>
        <p className="text-gray-500 mt-1 text-right">جدولة ومتابعة مواعيد الأطباء مع المرضى</p>
      </div>

      {/* الفلترة */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="flex gap-2 items-center w-full md:w-auto">
          <Select value={filterDoctor} onValueChange={setFilterDoctor}>
            <SelectTrigger className="w-40 text-right">
              <SelectValue placeholder="كل الأطباء" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأطباء</SelectItem>
              {doctors.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPatient} onValueChange={setFilterPatient}>
            <SelectTrigger className="w-40 text-right">
              <SelectValue placeholder="كل المرضى" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المرضى</SelectItem>
              {patients.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 text-right">
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              {statusOptions.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="w-40 text-right"
          />
          <Input
            placeholder="بحث بالاسم أو الملاحظات"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-right w-64"
          />
          <Search className="text-gray-400" size={18} />
        </div>
      </div>

      {/* نموذج إضافة موعد */}
      {/* {showAdd && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Plus size={18} />
              <span>إضافة موعد جديد</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-56">
                <Select value={newAppointment.doctorId} onValueChange={v => setNewAppointment(a => ({ ...a, doctorId: v }))}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر الطبيب" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-56">
                <Select value={newAppointment.patientId} onValueChange={v => setNewAppointment(a => ({ ...a, patientId: v }))}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر المريض" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="datetime-local"
                value={newAppointment.date}
                onChange={e => setNewAppointment(a => ({ ...a, date: e.target.value }))}
                className="w-56 text-right"
              />
              <Select value={newAppointment.status} onValueChange={v => setNewAppointment(a => ({ ...a, status: v as Appointment['status'] }))}>
                <SelectTrigger className="text-right w-40">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="ملاحظات (اختياري)"
                value={newAppointment.notes}
                onChange={e => setNewAppointment(a => ({ ...a, notes: e.target.value }))}
                className="w-64 text-right"
              />
              <Button onClick={handleAdd} className="w-full md:w-auto">حفظ</Button>
              <Button variant="outline" onClick={() => setShowAdd(false)} className="w-full md:w-auto">إلغاء</Button>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* جدول المواعيد */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <span>قائمة المواعيد</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">الطبيب</TableHead>
                <TableHead className="text-right">المريض</TableHead>
                <TableHead className="text-right">التاريخ والوقت</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">ملاحظات</TableHead>
                <TableHead className="text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">لا توجد مواعيد</TableCell>
                </TableRow>
              ) : (
                filtered.map((a, idx) => (
                  <TableRow key={a.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{a.doctorName}</TableCell>
                    <TableCell>{a.patientName}</TableCell>
                    <TableCell>{new Date(a.date).toLocaleString('ar-EG')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : a.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {statusOptions.find(s => s.value === a.status)?.label}
                      </span>
                    </TableCell>
                    <TableCell>{a.notes}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Appointments; 