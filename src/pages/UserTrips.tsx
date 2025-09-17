import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Clock, MapPin, Route } from 'lucide-react';

// Mock trip data for a specific user
const mockUserTrips = [
  {
    id: 'T001',
    startTime: '2024-09-17T08:30:00Z',
    endTime: '2024-09-17T09:05:00Z',
    duration: 35,
    distance: 12.5,
    mode: 'Bus',
    purpose: 'Work',
    origin: 'Ernakulam',
    destination: 'Kakkanad',
  },
  {
    id: 'T002',
    startTime: '2024-09-17T18:45:00Z', 
    endTime: '2024-09-17T19:20:00Z',
    duration: 35,
    distance: 12.5,
    mode: 'Bus',
    purpose: 'Work',
    origin: 'Kakkanad',
    destination: 'Ernakulam',
  },
  {
    id: 'T003',
    startTime: '2024-09-16T08:15:00Z',
    endTime: '2024-09-16T08:50:00Z', 
    duration: 35,
    distance: 12.5,
    mode: 'Metro',
    purpose: 'Work',
    origin: 'Ernakulam',
    destination: 'Kakkanad',
  },
  {
    id: 'T004',
    startTime: '2024-09-15T14:30:00Z',
    endTime: '2024-09-15T15:15:00Z',
    duration: 45,
    distance: 18.2,
    mode: 'Two-Wheeler',
    purpose: 'Shopping',
    origin: 'Ernakulam',
    destination: 'Lulu Mall',
  },
];

const UserTrips = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleTripClick = (tripId: string) => {
    navigate(`/users/${userId}/trips/${tripId}`);
  };

  const handleBackClick = () => {
    navigate('/users');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

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
  const mostCommonMode = 'Bus'; // Would calculate from data

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">User #{userId} - Trip History</h1>
              <Breadcrumbs />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Route className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalTrips}</p>
                  <p className="text-sm text-muted-foreground">Total Trips</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{avgDuration} min</p>
                  <p className="text-sm text-muted-foreground">Avg Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{mostCommonMode}</p>
                  <p className="text-sm text-muted-foreground">Most Common Mode</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trips Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trip History ({mockUserTrips.length} trips)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Route</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUserTrips.map((trip) => (
                  <TableRow
                    key={trip.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleTripClick(trip.id)}
                  >
                    <TableCell className="font-medium">{trip.id}</TableCell>
                    <TableCell>{formatDate(trip.startTime)}</TableCell>
                    <TableCell>{formatTime(trip.startTime)}</TableCell>
                    <TableCell>{formatTime(trip.endTime)}</TableCell>
                    <TableCell>{trip.duration} min</TableCell>
                    <TableCell>{trip.distance} km</TableCell>
                    <TableCell>
                      <Badge className={getModeColor(trip.mode)}>
                        {trip.mode}
                      </Badge>
                    </TableCell>
                    <TableCell>{trip.purpose}</TableCell>
                    <TableCell className="text-sm">
                      {trip.origin} → {trip.destination}
                    </TableCell>
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