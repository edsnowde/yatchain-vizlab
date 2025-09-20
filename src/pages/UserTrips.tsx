import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Clock, MapPin, Route, IndianRupee } from 'lucide-react';

// Mock trip data
const mockUserTrips = [
  { id: 'T001', startTime: '2024-09-17T08:30:00Z', endTime: '2024-09-17T09:05:00Z', duration: 35, distance: 12.5, mode: 'Bus', purpose: 'Work', origin: 'Ernakulam', destination: 'Kakkanad', cost: 15 },
  { id: 'T002', startTime: '2024-09-17T18:45:00Z', endTime: '2024-09-17T19:20:00Z', duration: 35, distance: 12.5, mode: 'Bus', purpose: 'Work', origin: 'Kakkanad', destination: 'Ernakulam', cost: 15 },
  { id: 'T003', startTime: '2024-09-16T08:15:00Z', endTime: '2024-09-16T08:50:00Z', duration: 35, distance: 12.5, mode: 'Metro', purpose: 'Work', origin: 'Ernakulam', destination: 'Kakkanad', cost: 25 },
  { id: 'T004', startTime: '2024-09-15T14:30:00Z', endTime: '2024-09-15T15:15:00Z', duration: 45, distance: 18.2, mode: 'Two-Wheeler', purpose: 'Shopping', origin: 'Ernakulam', destination: 'Lulu Mall', cost: 35 },
];

const UserTrips = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleTripClick = (tripId: string) => navigate(`/users/${userId}/trips/${tripId}`);
  const handleBackClick = () => navigate('/users');

  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (timestamp: string) => new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Bus': return 'bg-blue-100 text-blue-800';
      case 'Metro': return 'bg-green-100 text-green-800';
      case 'Two-Wheeler': return 'bg-orange-100 text-orange-800';
      case 'Train': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalTrips = mockUserTrips.length;
  const avgDuration = Math.round(mockUserTrips.reduce((sum, trip) => sum + trip.duration, 0) / totalTrips);
  const avgCost = Math.round(mockUserTrips.reduce((sum, trip) => sum + trip.cost, 0) / totalTrips);
  const mostCommonMode = 'Bus';

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Top bar */}
      <div className="border-b px-6 py-4 bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">User #{userId} - Trip History</h1>
            <Breadcrumbs />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: Route, label: 'Total Trips', value: totalTrips },
            { icon: Clock, label: 'Avg Duration', value: `${avgDuration} min` },
            { icon: IndianRupee, label: 'Avg Cost', value: `₹${avgCost}` },
            { icon: MapPin, label: 'Most Common Mode', value: mostCommonMode },
          ].map((card, idx) => (
            <Card key={idx} className="rounded-2xl shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <card.icon className="h-8 w-8 text-indigo-600" />
                  <div>
                    <p className="text-2xl font-bold text-indigo-900">{card.value}</p>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trips Table */}
        <Card className="rounded-2xl shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-indigo-900 font-semibold">Trip History ({mockUserTrips.length} trips)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="overflow-auto">
              <TableHeader>
                <TableRow className="bg-indigo-50">
                  {['Trip ID','Date','Start Time','End Time','Duration','Distance','Cost','Mode','Purpose','Route'].map(h => <TableHead key={h}>{h}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUserTrips.map(trip => (
                  <TableRow
                    key={trip.id}
                    className="cursor-pointer hover:bg-indigo-50 transition-colors duration-200"
                    onClick={() => handleTripClick(trip.id)}
                  >
                    <TableCell className="font-medium">{trip.id}</TableCell>
                    <TableCell>{formatDate(trip.startTime)}</TableCell>
                    <TableCell>{formatTime(trip.startTime)}</TableCell>
                    <TableCell>{formatTime(trip.endTime)}</TableCell>
                    <TableCell>{trip.duration} min</TableCell>
                    <TableCell>{trip.distance} km</TableCell>
                    <TableCell className="font-medium text-indigo-600">₹{trip.cost}</TableCell>
                    <TableCell>
                      <Badge className={getModeColor(trip.mode)}>{trip.mode}</Badge>
                    </TableCell>
                    <TableCell>{trip.purpose}</TableCell>
                    <TableCell className="text-sm">{trip.origin} → {trip.destination}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserTrips;
