import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsData, getHourlyData, getPurposeData } from '@/data/mockData';
import { Activity, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface ChartsSectionProps {
  stats: StatsData;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ stats }) => {
  const hourlyData = getHourlyData();
  const purposeData = getPurposeData();
  
  // Mode share data for pie chart
  const modeShareData = Object.entries(stats.modeShare).map(([mode, share]) => ({
    mode,
    share,
    color: getModeColor(mode)
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Mode Share Pie Chart */}
      <Card className="hover:shadow-hover transition-all duration-300 bg-gradient-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-1.5 bg-chart-blue/10 rounded-lg">
              <PieChartIcon className="h-4 w-4 text-chart-blue" />
            </div>
            Mode Share Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modeShareData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ mode, share }) => `${mode}: ${share}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="share"
                >
                  {modeShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Share']}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Demand Bar Chart */}
      <Card className="hover:shadow-hover transition-all duration-300 bg-gradient-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-1.5 bg-chart-green/10 rounded-lg">
              <BarChart3 className="h-4 w-4 text-chart-green" />
            </div>
            Hourly Demand Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  formatter={(value: any) => [value, 'Trips']}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="trips" 
                  fill="hsl(var(--chart-green))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Purpose Distribution Donut Chart */}
      <Card className="hover:shadow-hover transition-all duration-300 bg-gradient-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="p-1.5 bg-chart-orange/10 rounded-lg">
              <Activity className="h-4 w-4 text-chart-orange" />
            </div>
            Trip Purpose Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={purposeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ purpose, value }) => `${purpose}: ${value}%`}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {purposeData.map((entry, index) => (
                    <Cell key={`purpose-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Share']}
                  labelStyle={{ color: '#1f2937' }}
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to assign colors to transport modes
function getModeColor(mode: string): string {
  const colorMap: { [key: string]: string } = {
    'Bus': '#1e40af',
    'Metro': '#059669',
    'Train': '#7c3aed', 
    'Walk': '#eab308',
    'Two-Wheeler': '#ea580c',
    'Car': '#dc2626',
    'Auto-Rickshaw': '#8b5cf6'
  };
  return colorMap[mode] || '#6b7280';
}

export default ChartsSection;