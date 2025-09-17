import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users, MapPin } from 'lucide-react';
import { getHourlyData, getPurposeData } from '@/data/mockData';

// Mock analytics data
const modeShareData = [
  { mode: 'Bus', count: 520, percentage: 45 },
  { mode: 'Metro', count: 290, percentage: 25 },
  { mode: 'Two-Wheeler', count: 175, percentage: 15 },
  { mode: 'Walk', count: 115, percentage: 10 },
  { mode: 'Train', count: 60, percentage: 5 },
];

const dailyTripsData = [
  { date: 'Mon', trips: 1250 },
  { date: 'Tue', trips: 1340 },
  { date: 'Wed', trips: 1180 },
  { date: 'Thu', trips: 1420 },
  { date: 'Fri', trips: 1680 },
  { date: 'Sat', trips: 980 },
  { date: 'Sun', trips: 720 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('trips');

  const hourlyData = getHourlyData();
  const purposeData = getPurposeData();

  const COLORS = ['#1e40af', '#059669', '#ea580c', '#7c3aed', '#dc2626'];

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-card p-4">
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
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
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
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">8,570</p>
                    <p className="text-sm text-muted-foreground">Total Trips</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">1,245</p>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">15.2 km</p>
                    <p className="text-sm text-muted-foreground">Avg Distance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">8:30 AM</p>
                    <p className="text-sm text-muted-foreground">Peak Hour</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Mode Share Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Mode Share Distribution</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Daily Trips Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Trip Patterns</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Hourly Demand */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly Demand Pattern</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Trip Purpose Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Purpose Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={purposeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {purposeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Analytics Section */}
          <Card>
            <CardHeader>
              <CardTitle>Trip Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Peak Hours</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Morning: 8:00 - 10:00 AM</li>
                    <li>Evening: 5:00 - 7:00 PM</li>
                    <li>Weekend: 2:00 - 4:00 PM</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Popular Routes</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Ernakulam ↔ Kakkanad</li>
                    <li>Trivandrum ↔ Technopark</li>
                    <li>Calicut ↔ Cyberpark</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mode Preferences</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Work trips: Bus (60%)</li>
                    <li>Leisure trips: Two-Wheeler (40%)</li>
                    <li>Education: Metro (55%)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;