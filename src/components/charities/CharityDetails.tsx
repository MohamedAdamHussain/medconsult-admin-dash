
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
import { CharityData } from '@/types/charities';

interface CharityDetailsProps {
  charity: CharityData;
}

const CharityDetails: React.FC<CharityDetailsProps> = ({ charity }) => {
  return (
    <div className="space-y-6">
      {/* معلومات الجمعية */}
      <Card className="unified-card">
        <CardHeader className="unified-card-header">
          <CardTitle className="unified-card-title">معلومات الجمعية</CardTitle>
        </CardHeader>
        <CardContent className="unified-card-content space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-field">
              <h3 className="form-label">اسم الجمعية</h3>
              <p className="text-foreground font-medium">{charity.name}</p>
            </div>
            <div className="form-field">
              <h3 className="form-label">نسبة التخفيض</h3>
              <p className="text-foreground font-medium">{charity.discountPercentage}%</p>
            </div>
            <div className="form-field">
              <h3 className="form-label">الحالة</h3>
              <span className={`status-badge ${charity.isActive ? 'status-badge-approved' : 'status-badge-rejected'}`}>
                {charity.isActive ? 'نشطة' : 'غير نشطة'}
              </span>
            </div>
          </div>

          <div className="form-field">
            <h3 className="form-label">شروط الشراكة</h3>
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <p className="text-foreground">{charity.partnershipTerms || 'لا توجد شروط محددة'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* المستفيدون */}
      <Card className="unified-card">
        <CardHeader className="unified-card-header">
          <CardTitle className="unified-card-title">المرضى المستفيدون</CardTitle>
          <CardDescription className="unified-card-description">
            عدد المستفيدين: {charity.beneficiaries?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent className="unified-card-content">
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم المريض</TableHead>
                  <TableHead>رقم الملف</TableHead>
                  <TableHead>تاريخ الاستفادة</TableHead>
                  <TableHead>قيمة التخفيض</TableHead>
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
                      <TableCell className="font-medium">{beneficiary.name}</TableCell>
                      <TableCell>{beneficiary.fileNumber}</TableCell>
                      <TableCell>{beneficiary.benefitDate}</TableCell>
                      <TableCell>{beneficiary.discountAmount} ريال</TableCell>
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
