import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Download, Clock, MapPin, Route, Target, IndianRupee } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

import GoogleMapView from '@/components/GoogleMapView';

const TripDetail = () => {
  const { userId, tripId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPath, setCurrentPath] = useState<any[]>([]);
  const [animationIndex, setAnimationIndex] = useState(0);

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

  const handleBackClick = () => navigate(`/users/${userId}/trips`);

  const handlePlayTrip = () => {
    if (!isPlaying) {
      setCurrentPath([tripData.path[0]]);
      setAnimationIndex(1);
      toast({ title: "Playing Trip Animation", description: "Watch the trip path being traced on the map" });
    } else {
      toast({ title: "Trip Animation Stopped", description: "Animation has been paused" });
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!isPlaying) return;

    if (animationIndex >= tripData.path.length) {
      setIsPlaying(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentPath((prev) => [...prev, tripData.path[animationIndex]]);
      setAnimationIndex((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, animationIndex]);

  const handleExportTrip = () => {
    const blob = new Blob([JSON.stringify(tripData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trip-${tripId}-user-${userId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: "Trip Exported", description: "Trip data has been exported as JSON file" });
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

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
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Top Bar */}
      <div className="border-b px-6 py-4 bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-100 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button variant="ghost" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trips
            </Button>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">Trip #{tripId} (User #{userId})</h1>
            <Breadcrumbs />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button variant="outline" onClick={handlePlayTrip}>
              <Play className="h-4 w-4 mr-2" />
              {isPlaying ? 'Stop' : 'Play'} Trip
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button variant="outline" onClick={handleExportTrip}>
              <Download className="h-4 w-4 mr-2" />
              Export Trip
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden gap-6 p-6">
        {/* Map Panel */}
        <motion.div className="flex-1 h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <Card className="h-full rounded-2xl shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-indigo-600" />
                Trip Path Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)]">
              <GoogleMapView trips={[]} showSingleTrip tripPath={currentPath} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Trip Metadata Panel */}
        <div className="w-80 overflow-auto space-y-6">
          {/* Trip Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="rounded-2xl shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
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
                  <div>
                    <p className="text-sm text-muted-foreground">Distance</p>
                    <p className="font-semibold">{tripData.distance} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="font-semibold text-indigo-600">₹{tripData.cost}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Mode</p>
                    <Badge className={getModeColor(tripData.mode)}>{tripData.mode}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="font-semibold">{tripData.purpose}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Locations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="rounded-2xl shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Origin', 'Destination'].map((loc) => {
                  const point = loc === 'Origin' ? tripData.origin : tripData.destination;
                  return (
                    <div key={loc}>
                      <p className="text-sm text-muted-foreground">{loc}</p>
                      <p className="font-semibold">{point.name}</p>
                      <p className="text-xs text-muted-foreground">{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Path Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="rounded-2xl shadow-lg bg-white">
              <CardHeader>
                <CardTitle>Path Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tripData.path.map((point, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        idx === 0 ? 'bg-green-500' :
                        idx === tripData.path.length - 1 ? 'bg-red-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="text-sm">
                        <p className="font-medium">{point.timestamp}</p>
                        <p className="text-xs text-muted-foreground">{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
