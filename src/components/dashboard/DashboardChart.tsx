
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface BarChartData {
  name: string;
  value: number;
}

interface MultiLineData {
  name: string;
  [key: string]: string | number;
}

interface DashboardChartProps {
  title: string;
  type: 'bar' | 'pie' | 'line';
  data: ChartData[] | BarChartData[] | MultiLineData[];
  colors?: string[];
  height?: number;
  dataKeys?: string[];
  layout?: 'vertical' | 'horizontal';
  nameKey?: string;
  valueKey?: string;
}

const defaultColors = ['#007BFF', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8'];

const DashboardChart = ({ 
  title, 
  type, 
  data, 
  colors = defaultColors, 
  height = 300,
  dataKeys = ['value'],
  layout = 'horizontal',
  nameKey = 'name',
  valueKey = 'value',
}: DashboardChartProps) => {
  // Handle loading and empty states
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 h-full flex flex-col">
        {title && <h3 className="text-lg font-medium mb-4 text-right">{title}</h3>}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-sm">لا توجد بيانات</div>
            <p className="text-xs mt-1">لم يتم العثور على أي بيانات لعرضها</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full">
      {title && <h3 className="text-lg font-medium mb-4 text-right">{title}</h3>}
      
      <div style={{ height: `${height}px` }} dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            layout === 'vertical' ? (
              <BarChart
                layout="vertical"
                data={data as BarChartData[]}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey={nameKey} width={120} tickFormatter={(v) => truncateLabel(String(v))} />
                <Tooltip />
                <Legend />
                <Bar dataKey={valueKey} fill="#007BFF" />
              </BarChart>
            ) : (
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={nameKey} tickFormatter={(v) => truncateLabel(String(v))} angle={-25} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={valueKey} fill="#007BFF" />
              </BarChart>
            )
          ) : type === 'line' ? (
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} tickFormatter={(v) => truncateLabel(String(v))} />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey={valueKey}
                nameKey={nameKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

function truncateLabel(value: string, max: number = 12): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1) + '…';
}

export default DashboardChart;
