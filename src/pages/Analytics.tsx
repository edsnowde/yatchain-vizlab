import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users, MapPin, IndianRupee } from 'lucide-react';
import { getHourlyData, getPurposeData } from '@/data/mockData';
import { motion } from 'framer-motion';

// Mock analytics data
const modeShareData = [
  { mode: 'Bus', count: 520, percentage: 45, avgCost: 18 },
  { mode: 'Metro', count: 290, percentage: 25, avgCost: 25 },
  { mode: 'Two-Wheeler', count: 175, percentage: 15, avgCost: 35 },
  { mode: 'Walk', count: 115, percentage: 10, avgCost: 0 },
  { mode: 'Train', count: 60, percentage: 5, avgCost: 150 },
];

const dailyTripsData = [
  { date: 'Mon', trips: 1250, cost: 22450 },
  { date: 'Tue', trips: 1340, cost: 24120 },
  { date: 'Wed', trips: 1180, cost: 21240 },
  { date: 'Thu', trips: 1420, cost: 25560 },
  { date: 'Fri', trips: 1680, cost: 30240 },
  { date: 'Sat', trips: 980, cost: 17640 },
  { date: 'Sun', trips: 720, cost: 12960 },
];

const costAnalyticsData = [
  { range: '₹0-10', count: 245, percentage: 28 },
  { range: '₹11-25', count: 320, percentage: 37 },
  { range: '₹26-50', count: 180, percentage: 21 },
  { range: '₹51-100', count: 85, percentage: 10 },
  { range: '₹100+', count: 30, percentage: 4 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('trips');

  const hourlyData = getHourlyData();
  const purposeData = getPurposeData();
  const COLORS = ['#1e40af', '#059669', '#ea580c', '#7c3aed', '#dc2626'];

  // Framer Motion Variants
  const container = {
    hidden: {},
    show: { 
      transition: { 
        staggerChildren: 0.15 
      } 
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className="h-screen flex flex-col"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Top bar */}
      <motion.div variants={item} className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
            <Breadcrumbs />
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="30days">Daily</SelectItem>
                <SelectItem value="7days">Weekly</SelectItem>
                <SelectItem value="90days">Monthly</SelectItem>
                <SelectItem value="90days">Quarter Yearly</SelectItem>
                <SelectItem value="90days">Yearly </SelectItem>
                <SelectItem value="90days">Last 5 years</SelectItem>

                {/* <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                                <SelectItem value="90days">Last 6 months </SelectItem>
                <SelectItem value="90days">Last 12 months</SelectItem> */}


              </SelectContent>
            </Select>

            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trips">Trips</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 p-6 overflow-auto space-y-6">
        {/* Key Metrics */}
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[{
            icon: <TrendingUp className="h-8 w-8 text-primary" />,
            value: '8,570',
            label: 'Total Trips'
          }, {
            icon: <Users className="h-8 w-8 text-primary" />,
            value: '1,245',
            label: 'Active Users'
          }, {
            icon: <MapPin className="h-8 w-8 text-primary" />,
            value: '15.2 km',
            label: 'Avg Distance'
          }, {
            icon: <IndianRupee className="h-8 w-8 text-primary" />,
            value: '₹24.5',
            label: 'Avg Cost'
          }].map((metric, idx) => (
            <motion.div key={idx} variants={item}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    {metric.icon}
                    <div>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <motion.div variants={container} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[{
            title: 'Mode Share Distribution',
            chart: (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modeShareData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mode" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#1e40af" />
                </BarChart>
              </ResponsiveContainer>
            )
          }, {
            title: 'Daily Trip Patterns',
            chart: (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTripsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="trips" stroke="#1e40af" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )
          }, {
            title: 'Hourly Demand Pattern',
            chart: (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="trips" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            )
          }, {
            title: 'Cost Distribution Analysis',
            chart: (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costAnalyticsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percentage }) => `${range}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {costAnalyticsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, 'Trips']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )
          }, {
            title: 'Daily Cost Trends',
            chart: (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTripsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [
                    name === 'cost' ? `₹${value.toLocaleString()}` : value,
                    name === 'cost' ? 'Total Cost' : 'Trips'
                  ]} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="trips" fill="#1e40af" name="Trips" />
                  <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#ea580c" strokeWidth={2} name="Cost (₹)" />
                </LineChart>
              </ResponsiveContainer>
            )
          }].map((chartObj, idx) => (
            <motion.div key={idx} variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle>{chartObj.title}</CardTitle>
                </CardHeader>
                <CardContent>{chartObj.chart}</CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
