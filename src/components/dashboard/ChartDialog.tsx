import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardChart from "./DashboardChart";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  chartType: 'bar' | 'pie' | 'line';
  data: any[];
  loading?: boolean;
  error?: string | null;
  colors?: string[];
  dataKeys?: string[];
  showDataList?: boolean;
  renderDataItem?: (item: any, index: number) => React.ReactNode;
}

const ChartDialog = ({
  open,
  onOpenChange,
  title,
  chartType,
  data,
  loading = false,
  error = null,
  colors,
  dataKeys,
  showDataList = true,
  renderDataItem,
}: ChartDialogProps) => {
  const renderLoadingState = () => (
    <div className="space-y-4">
      <Skeleton className="h-[300px] w-full" />
      {showDataList && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-8">
      <div className="text-red-500 mb-2">حدث خطأ في تحميل البيانات</div>
      <p className="text-sm text-muted-foreground">{error}</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <div className="text-muted-foreground mb-2">لا توجد بيانات</div>
      <p className="text-sm text-muted-foreground">لم يتم العثور على أي بيانات لعرضها</p>
    </div>
  );

  const renderContent = () => {
    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    if (!data || data.length === 0) return renderEmptyState();

    return (
      <div className="space-y-6">
        {/* Chart */}
        <div className="h-[400px]">
          <DashboardChart
            title=""
            type={chartType}
            data={data}
            colors={colors}
            dataKeys={dataKeys}
            height={400}
          />
        </div>

        {/* Data List */}
        {showDataList && (
          <div className="space-y-2">
            <h4 className="font-medium text-right mb-3">قائمة البيانات</h4>
            {data.map((item, index) => (
              renderDataItem ? 
                renderDataItem(item, index) : 
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-right">{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ChartDialog;