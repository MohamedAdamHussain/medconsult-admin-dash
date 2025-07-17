
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
import { Pencil, UserPlus, Users, Trash2 } from 'lucide-react';
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
    <Card className="unified-card">
      <CardHeader className="unified-card-header flex flex-row items-center justify-between">
        <CardTitle className="unified-card-title">قائمة الجمعيات الخيرية</CardTitle>
        <Button onClick={onAddCharity} className="action-button action-button-primary gap-2">
          <UserPlus className="h-4 w-4" />
          <span>إضافة جمعية جديدة</span>
        </Button>
      </CardHeader>
      <CardContent className="unified-card-content">
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الجمعية</TableHead>
                <TableHead>نسبة التخفيض</TableHead>
                <TableHead>عدد المستفيدين</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
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
                    <TableCell className="font-medium">{charity.name}</TableCell>
                    <TableCell>{charity.discountPercentage}%</TableCell>
                    <TableCell>{charity.beneficiariesCount}</TableCell>
                    <TableCell>
                      <span className={`status-badge ${charity.isActive ? 'status-badge-approved' : 'status-badge-rejected'}`}>
                        {charity.isActive ? 'نشطة' : 'غير نشطة'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onViewDetails(charity)} 
                          title="عرض التفاصيل"
                          className="action-button action-button-ghost"
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEditCharity(charity)} 
                          title="تعديل"
                          className="action-button action-button-ghost"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onDeleteCharity(charity.id)} 
                          title="حذف"
                          className="action-button action-button-ghost text-destructive hover:text-destructive"
                        >
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
