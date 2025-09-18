import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Download, Clock, MapPin, Route, Target, IndianRupee } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import GoogleMapView from '@/components/GoogleMapView';

const TripDetail = () => {
  const { userId, tripId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock trip detail data
  const tripData = {
    id: tripId,
    userId: userId,
    startTime: '2024-09-17T08:30:00Z',
    endTime: '2024-09-17T09:05:00Z',
    duration: 35,
    distance: 12.5,
    mode: 'Bus',
    purpose: 'Work',
    cost: 15,
    origin: { name: 'Ernakulam Junction', lat: 9.9312, lng: 76.2673 },
    destination: { name: 'InfoPark Kakkanad', lat: 9.9816, lng: 76.3127 },
    path: [
      { lat: 9.9312, lng: 76.2673, timestamp: '08:30' },
      { lat: 9.9350, lng: 76.2800, timestamp: '08:35' },
      { lat: 9.9400, lng: 76.2950, timestamp: '08:45' },
      { lat: 9.9600, lng: 76.3000, timestamp: '08:55' },
      { lat: 9.9816, lng: 76.3127, timestamp: '09:05' },
    ]
  };

  const handleBackClick = () => {
    navigate(`/users/${userId}/trips`);
  };

  const handlePlayTrip = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Trip Animation Stopped" : "Playing Trip Animation",
      description: isPlaying ? "Animation has been paused" : "Watch the trip path being traced on the map",
    });
  };

  const handleExportTrip = () => {
    const exportData = {
      tripId: tripData.id,
      userId: tripData.userId,
      startTime: tripData.startTime,
      endTime: tripData.endTime,
      duration: tripData.duration,
      distance: tripData.distance,
      mode: tripData.mode,
      purpose: tripData.purpose,
      origin: tripData.origin,
      destination: tripData.destination,
      path: tripData.path
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trip-${tripId}-user-${userId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Trip Exported",
      description: "Trip data has been exported as JSON file",
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trips
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Trip #{tripId} (User #{userId})
              </h1>
              <Breadcrumbs />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePlayTrip}>
              <Play className="h-4 w-4 mr-2" />
              {isPlaying ? 'Stop' : 'Play'} Trip
            </Button>
            <Button variant="outline" onClick={handleExportTrip}>
              <Download className="h-4 w-4 mr-2" />
              Export Trip
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Map Area */}
        <div className="flex-1 p-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Trip Path Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
              <GoogleMapView 
                trips={[]}
                showSingleTrip={true}
                tripPath={tripData.path}
              />
            </CardContent>
          </Card>
        </div>

        {/* Trip Metadata Panel */}
        <div className="w-80 border-l p-6 bg-card overflow-auto">
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">{formatDate(tripData.startTime)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Time</p>
                    <p className="font-semibold">{formatTime(tripData.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Time</p>
                    <p className="font-semibold">{formatTime(tripData.endTime)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{tripData.duration} min</p>
                  </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-semibold">{tripData.distance} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="font-semibold text-primary">₹{tripData.cost}</p>
                  </div>
                </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mode</p>
                    <Badge className={getModeColor(tripData.mode)}>
                      {tripData.mode}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="font-semibold">{tripData.purpose}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-semibold">{tripData.origin.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tripData.origin.lat.toFixed(4)}, {tripData.origin.lng.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-semibold">{tripData.destination.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {tripData.destination.lat.toFixed(4)}, {tripData.destination.lng.toFixed(4)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Path Points */}
            <Card>
              <CardHeader>
                <CardTitle>Path Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tripData.path.map((point, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-green-500' : 
                        index === tripData.path.length - 1 ? 'bg-red-500' : 
                        'bg-blue-500'
                      }`} />
                      <div className="text-sm">
                        <p className="font-medium">{point.timestamp}</p>
                        <p className="text-xs text-muted-foreground">
                          {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;