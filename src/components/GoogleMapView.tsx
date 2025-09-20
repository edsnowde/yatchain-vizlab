import React, { useState, useEffect, useRef } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertCircle } from 'lucide-react';
import { TripData } from '@/data/mockData';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface GoogleMapViewProps {
  trips: TripData[];
  showSingleTrip?: boolean;
  tripPath?: Array<{ lat: number; lng: number; timestamp?: string }>;
}

// Helper: jitter coordinates slightly to avoid overlapping markers
const jitterCoordinate = (coord: number) => {
  const offset = (Math.random() - 0.5) * 0.002; // ~200m shift
  return coord + offset;
};

// Google Maps component
const GoogleMap: React.FC<{ 
  trips: TripData[]; 
  mapId: string; 
  showSingleTrip?: boolean;
  tripPath?: Array<{ lat: number; lng: number; timestamp?: string }>;
}> = ({ trips, mapId, showSingleTrip, tripPath }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 10.8505, lng: 76.2711 },
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        { featureType: "all", elementType: "geometry.fill", stylers: [{ saturation: -100 }] },
        { featureType: "water", elementType: "all", stylers: [{ color: "#e8f4f8" }] }
      ]
    });

    mapInstanceRef.current = map;

    return () => {
      if (heatmapRef.current) heatmapRef.current.setMap(null);
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear previous markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    if (heatmapRef.current) heatmapRef.current.setMap(null);

    const map = mapInstanceRef.current;

    if (showSingleTrip && tripPath && tripPath.length >= 2) {
      const startPoint = tripPath[0];
      const endPoint = tripPath[tripPath.length - 1];

      const startMarker = new google.maps.Marker({
        position: { lat: startPoint.lat, lng: startPoint.lng },
        map,
        title: 'Trip Start',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        }
      });

      const endMarker = new google.maps.Marker({
        position: { lat: endPoint.lat, lng: endPoint.lng },
        map,
        title: 'Trip End',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        }
      });

      const pathCoordinates = tripPath.map(point => ({ lat: point.lat, lng: point.lng }));

      new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map
      });

      markersRef.current.push(startMarker, endMarker);

      const bounds = new google.maps.LatLngBounds();
      pathCoordinates.forEach(point => bounds.extend(point));
      map.fitBounds(bounds);

    } else if (trips.length > 0) {
      // Heatmap layer
      const heatmapData = trips.map(trip => ({
        location: new google.maps.LatLng(trip.origin[1], trip.origin[0]),
        weight: trip.count
      }));

      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map,
        radius: 25,
        opacity: 0.7,
      });

      heatmapRef.current = heatmap;

      // Create markers with hover info windows
      trips.forEach((trip) => {
        const marker = new google.maps.Marker({
          position: { 
            lat: jitterCoordinate(trip.origin[1]), 
            lng: jitterCoordinate(trip.origin[0]) 
          },
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: Math.sqrt(trip.count) * 2,
            fillColor: getColorByMode(trip.mode),
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="font-size:14px;">
              <strong>Mode:</strong> ${trip.mode}<br/>
              <strong>Purpose:</strong> ${trip.purpose}<br/>
              <strong>Trips:</strong> ${trip.count}<br/>
              <strong>Distance:</strong> ${trip.distance} km
            </div>
          `
        });

        marker.addListener('mouseover', () => infoWindow.open(map, marker));
        marker.addListener('mouseout', () => infoWindow.close());

        markersRef.current.push(marker);
      });
    }
  }, [trips, showSingleTrip, tripPath]);

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

  return (
    <motion.div
      ref={mapRef} 
      className="w-full h-full rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    />
  );
};

const GoogleMapView: React.FC<GoogleMapViewProps> = ({ trips, showSingleTrip, tripPath }) => {
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
          apiKey="  " // <-- Add your Google Maps API key
          libraries={['visualization']}
          render={(status) => {
            if (status === 'FAILURE') {
              return (
                <div className="h-full flex items-center justify-center p-6">
                  <div className="text-center space-y-2">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                    <p className="text-destructive font-medium">Failed to load Google Maps</p>
                    <p className="text-sm text-muted-foreground">Please check your API key</p>
                  </div>
                </div>
              );
            }
            return <div className="h-full flex items-center justify-center">Loading Google Maps...</div>;
          }}
        >
          <GoogleMap 
            trips={trips} 
            mapId="trip-heatmap" 
            showSingleTrip={showSingleTrip}
            tripPath={tripPath}
          />
        </Wrapper>
      </CardContent>
    </Card>
  );
};

export default GoogleMapView;
