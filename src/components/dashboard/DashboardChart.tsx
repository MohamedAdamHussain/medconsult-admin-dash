
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
  Cell
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

interface DashboardChartProps {
  title: string;
  type: 'bar' | 'pie';
  data: ChartData[] | BarChartData[];
  colors?: string[];
}

const defaultColors = ['#007BFF', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8'];

const DashboardChart = ({ title, type, data, colors = defaultColors }: DashboardChartProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full">
      <h3 className="text-lg font-medium mb-4 text-right">{title}</h3>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
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
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#007BFF" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
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

export default DashboardChart;
