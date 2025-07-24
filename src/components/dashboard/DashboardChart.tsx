
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
}

const defaultColors = ['#007BFF', '#28a745', '#ffc107', '#dc3545', '#6c757d', '#17a2b8'];

const DashboardChart = ({ 
  title, 
  type, 
  data, 
  colors = defaultColors, 
  height = 300,
  dataKeys = ['value'] 
}: DashboardChartProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-large p-6 h-full border border-border/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <h3 className="text-xl font-bold mb-6 text-right bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">{title}</h3>
      
      <div style={{ height: `${height}px` }} dir="ltr">
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
              <Bar dataKey="value" fill="url(#blueGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </BarChart>
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
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((key, index) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]} 
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 2, fill: colors[index % colors.length] }}
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
                outerRadius={110}
                innerRadius={40}
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
