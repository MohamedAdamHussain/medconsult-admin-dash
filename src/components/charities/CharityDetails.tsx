
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Heart } from 'lucide-react';
import { CharityData } from '@/types/charities';

interface CharityDetailsProps {
  charity: CharityData;
}

const CharityDetails: React.FC<CharityDetailsProps> = ({ charity }) => {
  return (
    <div className="space-y-6">
      {/* Charity Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">معلومات الجمعية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground text-right">اسم الجمعية</h3>
              <p className="text-right">{charity.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground text-right">نسبة التخفيض</h3>
              <p className="text-right">{charity.discountPercentage}%</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground text-right">الحالة</h3>
              <span className={`status-badge ${charity.isActive ? 'status-badge-approved' : 'status-badge-rejected'}`}>
                {charity.isActive ? 'نشطة' : 'غير نشطة'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 text-right">شروط الشراكة</h3>
            <div className="bg-gray-50 p-3 rounded-md text-right">
              {charity.partnershipTerms || 'لا توجد شروط محددة'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beneficiaries */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">المرضى المستفيدون</CardTitle>
          <CardDescription className="text-right">
            عدد المستفيدين: {charity.beneficiaries?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم المريض</TableHead>
                  <TableHead className="text-right">رقم الملف</TableHead>
                  <TableHead className="text-right">تاريخ الاستفادة</TableHead>
                  <TableHead className="text-right">قيمة التخفيض</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!charity.beneficiaries || charity.beneficiaries.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                      لا يوجد مستفيدون من هذه الجمعية حتى الآن
                    </TableCell>
                  </TableRow>
                ) : (
                  charity.beneficiaries.map((beneficiary) => (
                    <TableRow key={beneficiary.id}>
                      <TableCell className="text-right font-medium">{beneficiary.name}</TableCell>
                      <TableCell className="text-right">{beneficiary.fileNumber}</TableCell>
                      <TableCell className="text-right">{beneficiary.benefitDate}</TableCell>
                      <TableCell className="text-right">{beneficiary.discountAmount} ريال</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharityDetails;
