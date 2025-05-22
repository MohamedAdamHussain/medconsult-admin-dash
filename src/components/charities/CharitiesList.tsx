
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, UserPlus, Users, Heart, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CharityData } from '@/types/charities';

interface CharitiesListProps {
  charities: CharityData[];
  onViewDetails: (charity: CharityData) => void;
  onAddCharity: () => void;
  onEditCharity: (charity: CharityData) => void;
  onDeleteCharity: (id: string) => void;
}

const CharitiesList: React.FC<CharitiesListProps> = ({
  charities,
  onViewDetails,
  onAddCharity,
  onEditCharity,
  onDeleteCharity,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-right">قائمة الجمعيات الخيرية</CardTitle>
        <Button onClick={onAddCharity} className="gap-1">
          <UserPlus className="h-4 w-4" />
          <span>إضافة جمعية جديدة</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">اسم الجمعية</TableHead>
                <TableHead className="text-right">نسبة التخفيض</TableHead>
                <TableHead className="text-right">عدد المستفيدين</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                    لا توجد جمعيات خيرية مضافة
                  </TableCell>
                </TableRow>
              ) : (
                charities.map((charity) => (
                  <TableRow key={charity.id}>
                    <TableCell className="text-right font-medium">{charity.name}</TableCell>
                    <TableCell className="text-right">{charity.discountPercentage}%</TableCell>
                    <TableCell className="text-right">{charity.beneficiariesCount}</TableCell>
                    <TableCell className="text-right">
                      <span className={`status-badge ${charity.isActive ? 'status-badge-approved' : 'status-badge-rejected'}`}>
                        {charity.isActive ? 'نشطة' : 'غير نشطة'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => onViewDetails(charity)} title="عرض التفاصيل">
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEditCharity(charity)} title="تعديل">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteCharity(charity.id)} title="حذف">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharitiesList;
