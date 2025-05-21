
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import DashboardChart from '@/components/dashboard/DashboardChart';
import { 
  CalendarDays,
  Calendar,
  Users, 
  UserCheck, 
  MessageSquare, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';

// بيانات عينة للمخطط الخطي
const weeklyData = [
  { name: 'السبت', استشارات: 24, اطباء: 4, مرضى: 18 },
  { name: 'الأحد', استشارات: 35, اطباء: 5, مرضى: 25 },
  { name: 'الإثنين', استشارات: 20, اطباء: 3, مرضى: 15 },
  { name: 'الثلاثاء', استشارات: 45, اطباء: 7, مرضى: 30 },
  { name: 'الأربعاء', استشارات: 40, اطباء: 6, مرضى: 28 },
  { name: 'الخميس', استشارات: 55, اطباء: 8, مرضى: 35 },
  { name: 'الجمعة', استشارات: 30, اطباء: 5, مرضى: 22 }
];

const monthlyData = [
  { name: 'يناير', استشارات: 240, اطباء: 20, مرضى: 180 },
  { name: 'فبراير', استشارات: 350, اطباء: 25, مرضى: 250 },
  { name: 'مارس', استشارات: 200, اطباء: 18, مرضى: 150 },
  { name: 'إبريل', استشارات: 450, اطباء: 30, مرضى: 300 },
  { name: 'مايو', استشارات: 400, اطباء: 28, مرضى: 280 },
  { name: 'يونيو', استشارات: 550, اطباء: 35, مرضى: 350 }
];

// مكون KPI
const KpiCard = ({ title, value, prevValue, icon: Icon, trend }) => {
  const trendPercent = ((value - prevValue) / prevValue) * 100;
  const isPositive = trendPercent >= 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trendPercent).toFixed(1)}%
            </span>
          </div>
        </div>
        <h3 className="text-right text-2xl font-bold mt-2">{value}</h3>
        <p className="text-right text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
};

const KPI = () => {
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month' | 'quarter'>('week');

  // اختيار البيانات بناءً على المدة الزمنية
  const chartData = timeFrame === 'week' ? weeklyData : monthlyData;

  // بيانات المؤشرات الرئيسية
  const kpiData = [
    {
      title: "استشارات اليوم",
      value: 45,
      prevValue: 38,
      icon: MessageSquare,
      trend: "+18.4%"
    },
    {
      title: "أطباء جدد",
      value: 8,
      prevValue: 5,
      icon: UserCheck,
      trend: "+60%"
    },
    {
      title: "مرضى جدد",
      value: 32,
      prevValue: 28,
      icon: Users,
      trend: "+14.3%"
    },
    {
      title: "شكاوى جديدة",
      value: 5,
      prevValue: 8,
      icon: AlertTriangle,
      trend: "-37.5%"
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-row-reverse justify-between items-center">
          <h1 className="text-3xl font-bold">لوحة مؤشرات الأداء</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>تخصيص</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>تصدير التقرير</span>
            </Button>
          </div>
        </div>
        <p className="text-gray-500 mt-1 text-right">مؤشرات الأداء الرئيسية للمنصة في الوقت الحالي</p>
      </div>

      {/* أزرار اختيار المدة الزمنية */}
      <div className="flex justify-end mb-6">
        <Tabs 
          defaultValue="week" 
          value={timeFrame}
          className="w-auto" 
          onValueChange={(val) => setTimeFrame(val as 'day' | 'week' | 'month' | 'quarter')}
        >
          <TabsList className="grid grid-cols-4 w-auto">
            <TabsTrigger value="day">يومي</TabsTrigger>
            <TabsTrigger value="week">أسبوعي</TabsTrigger>
            <TabsTrigger value="month">شهري</TabsTrigger>
            <TabsTrigger value="quarter">ربع سنوي</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* بطاقات المؤشرات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpiData.map((kpi, index) => (
          <KpiCard
            key={index}
            title={kpi.title}
            value={kpi.value}
            prevValue={kpi.prevValue}
            icon={kpi.icon}
            trend={kpi.trend}
          />
        ))}
      </div>

      {/* مخططات المؤشرات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 justify-end">
              <Activity className="h-5 w-5" />
              <span>الاستشارات والمستخدمين</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <DashboardChart 
              title="" 
              type="line" 
              data={chartData} 
              dataKeys={['استشارات', 'اطباء', 'مرضى']} 
              colors={['#4f46e5', '#10b981', '#f59e0b']}
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 justify-end">
              <Activity className="h-5 w-5" />
              <span>توزيع الاستشارات حسب التخصص</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <DashboardChart 
              title="" 
              type="pie" 
              data={[
                { name: "باطنية", value: 35 },
                { name: "جلدية", value: 25 },
                { name: "أطفال", value: 20 },
                { name: "عظام", value: 15 },
                { name: "نفسية", value: 5 }
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* مؤشرات التفاعل والاستجابة */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 justify-end">
            <Activity className="h-5 w-5" />
            <span>مؤشرات التفاعل والاستجابة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-right">متوسط وقت الاستجابة للاستشارات</p>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">15 دقيقة</span>
                <span className="text-muted-foreground">المستهدف: 10 دقائق</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-right">نسبة الرضا عن الاستشارات</p>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-500 rounded-full w-4/5"></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">80%</span>
                <span className="text-muted-foreground">المستهدف: 90%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-right">متوسط تقييم الأطباء</p>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-amber-500 rounded-full w-[85%]"></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">4.2/5</span>
                <span className="text-muted-foreground">المستهدف: 4.5/5</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default KPI;
