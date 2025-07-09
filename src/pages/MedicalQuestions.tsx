import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Trash2, Plus, Search } from 'lucide-react';

// نوع بيانات السؤال الطبي
interface MedicalQuestion {
  id: string;
  question: string;
  specialty: string;
}

// mock قائمة الاختصاصات (يمكن استبدالها لاحقاً من SpecialtiesList)
const specialties = [
  { id: 'cardiology', name: 'أمراض القلب' },
  { id: 'dermatology', name: 'الأمراض الجلدية' },
  { id: 'neurology', name: 'الأعصاب' },
  { id: 'pediatrics', name: 'طب الأطفال' },
  { id: 'orthopedics', name: 'العظام' },
];

const initialQuestions: MedicalQuestion[] = [
  { id: '1', question: 'هل تعاني من أمراض مزمنة؟', specialty: 'cardiology' },
  { id: '2', question: 'هل لديك حساسية من أدوية معينة؟', specialty: 'dermatology' },
];

const MedicalQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<MedicalQuestion[]>(initialQuestions);
  const [newQuestion, setNewQuestion] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [search, setSearch] = useState('');

  // إضافة سؤال جديد
  const handleAdd = () => {
    if (!newQuestion.trim() || !newSpecialty) return;
    setQuestions(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        question: newQuestion.trim(),
        specialty: newSpecialty,
      },
    ]);
    setNewQuestion('');
    setNewSpecialty('');
  };

  // حذف سؤال
  const handleDelete = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  // فلترة الأسئلة
  const filtered = questions.filter(q =>
    (filterSpecialty === 'all' || !filterSpecialty || q.specialty === filterSpecialty) &&
    (!search || q.question.includes(search))
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">الأسئلة الطبية الشائعة</h1>
        <p className="text-gray-500 mt-1 text-right">إدارة الأسئلة التي يمكن أن يطرحها الأطباء على المرضى حسب الاختصاص</p>
      </div>

      {/* نموذج إضافة سؤال */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Plus size={18} />
            <span>إضافة سؤال جديد</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder="نص السؤال الطبي"
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                className="text-right"
              />
            </div>
            <div className="w-56">
              <Select value={newSpecialty} onValueChange={setNewSpecialty}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الاختصاص الطبي" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} className="w-full md:w-auto">إضافة</Button>
          </div>
        </CardContent>
      </Card>

      {/* الفلترة */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between">
        <div className="flex gap-2 items-center w-full md:w-auto">
          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger className="w-48 text-right">
              <SelectValue placeholder="فلترة حسب الاختصاص" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الاختصاصات</SelectItem>
              {specialties.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="بحث في نص السؤال"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-right w-64"
          />
          <Search className="text-gray-400" size={18} />
        </div>
      </div>

      {/* جدول الأسئلة */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <span>قائمة الأسئلة الطبية</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">السؤال</TableHead>
                <TableHead className="text-right">الاختصاص</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">لا توجد أسئلة</TableCell>
                </TableRow>
              ) : (
                filtered.map((q, idx) => (
                  <TableRow key={q.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{q.question}</TableCell>
                    <TableCell>{specialties.find(s => s.id === q.specialty)?.name || q.specialty}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}>
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

export default MedicalQuestions; 