import React, { useState, useEffect, useRef } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Key, AlertCircle } from 'lucide-react';
import { TripData } from '@/data/mockData';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface GoogleMapViewProps {
  trips: TripData[];
}

// Google Maps component
const GoogleMap: React.FC<{ trips: TripData[]; mapId: string }> = ({ trips, mapId }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map centered on Kerala, India
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 10.8505, lng: 76.2711 }, // Kerala center
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [{ saturation: -100 }]
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ color: "#e8f4f8" }]
        }
      ]
    });

    mapInstanceRef.current = map;

    return () => {
      // Cleanup
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || trips.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Clear existing heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
    }

    // Create heatmap data
    const heatmapData = trips.map(trip => ({
      location: new google.maps.LatLng(trip.origin[1], trip.origin[0]),
      weight: trip.count
    }));

    // Add heatmap layer
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: mapInstanceRef.current,
      radius: 20,
      opacity: 0.8,
      gradient: [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]
    });

    heatmapRef.current = heatmap;

    // Add origin markers with info windows
    trips.forEach((trip, index) => {
      const marker = new google.maps.Marker({
        position: { lat: trip.origin[1], lng: trip.origin[0] },
        map: mapInstanceRef.current,
        title: `${trip.count} trips`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: Math.sqrt(trip.count) * 2,
          fillColor: getColorByMode(trip.mode),
          fillOpacity: 0.8,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937;">Trip Details</h4>
            <p style="margin: 4px 0; color: #4b5563;"><strong>Count:</strong> ${trip.count} trips</p>
            <p style="margin: 4px 0; color: #4b5563;"><strong>Mode:</strong> ${trip.mode}</p>
            <p style="margin: 4px 0; color: #4b5563;"><strong>Purpose:</strong> ${trip.purpose}</p>
            <p style="margin: 4px 0; color: #4b5563;"><strong>Distance:</strong> ${trip.distance} km</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

  }, [trips]);

  // Helper function to get color by transport mode
  const getColorByMode = (mode: string) => {
    const colors = {
      'Bus': '#3b82f6',
      'Metro': '#10b981',
      'Train': '#8b5cf6',
      'Walk': '#f59e0b',
      'Two-Wheeler': '#ef4444',
      'Car': '#6b7280'
    };
    return colors[mode as keyof typeof colors] || '#6b7280';
  };

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
};

const GoogleMapView: React.FC<GoogleMapViewProps> = ({ trips }) => {
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitApiKey = () => {
    if (tempApiKey.trim()) {
      setIsLoading(true);
      setApiKey(tempApiKey.trim());
      setShowTokenInput(false);
      
      // Simulate loading delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  if (showTokenInput) {
    return (
      <Card className="yatrachain-card h-full flex items-center justify-center">
        <CardContent className="w-full max-w-md space-y-4">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-primary rounded-full">
                <Key className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Google Maps API Required</h3>
            <p className="text-sm text-muted-foreground">
              Please enter your Google Maps API key to visualize trip data
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="google-api-key">Google Maps API Key</Label>
              <Input
                id="google-api-key"
                type="password"
                placeholder="AIza..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitApiKey()}
                className="mt-1"
              />
            </div>
            
            <Button 
              onClick={handleSubmitApiKey}
              disabled={!tempApiKey.trim()}
              className="w-full yatrachain-button bg-gradient-primary"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Initialize Map
            </Button>

            <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div className="text-xs text-warning-foreground">
                <p className="font-medium">Need an API key?</p>
                <p>Visit Google Cloud Console → APIs & Services → Credentials → Create API Key</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="yatrachain-card h-full flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading Google Maps...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="yatrachain-card h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Trip Heatmap & Origin-Destination Flows
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Wrapper 
          apiKey={apiKey}
          libraries={['visualization']}
          render={(status) => {
            if (status === 'FAILURE') {
              return (
                <div className="h-full flex items-center justify-center p-6">
                  <div className="text-center space-y-2">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                    <p className="text-destructive font-medium">Failed to load Google Maps</p>
                    <p className="text-sm text-muted-foreground">Please check your API key</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowTokenInput(true)}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              );
            }
            return <div className="h-full flex items-center justify-center">Loading Google Maps...</div>;
          }}
        >
          <GoogleMap trips={trips} mapId="trip-heatmap" />
        </Wrapper>
      </CardContent>
    </Card>
  );
};

export default GoogleMapView;