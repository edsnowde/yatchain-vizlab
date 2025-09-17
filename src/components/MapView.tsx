import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TripData, keralaCenter } from '@/data/mockData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface MapViewProps {
  trips: TripData[];
}

const MapView: React.FC<MapViewProps> = ({ trips }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    setIsLoading(true);
    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: keralaCenter,
        zoom: 8,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('load', () => {
        setIsLoading(false);
        addHeatmapLayer();
        addODFlows();
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Failed to initialize map:', error);
      setIsLoading(false);
    }
  };

  const addHeatmapLayer = () => {
    if (!map.current) return;

    // Create GeoJSON from trip origins
    const heatmapData = {
      type: 'FeatureCollection' as const,
      features: trips.map(trip => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: trip.origin
        },
        properties: {
          count: trip.count,
          mode: trip.mode,
          purpose: trip.purpose
        }
      }))
    };

    map.current.addSource('trip-origins', {
      type: 'geojson',
      data: heatmapData
    });

    map.current.addLayer({
      id: 'trip-heatmap',
      type: 'heatmap',
      source: 'trip-origins',
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'count'],
          0, 0,
          500, 1
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          15, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33, 102, 172, 0)',
          0.2, 'rgb(103, 169, 207)',
          0.4, 'rgb(209, 229, 240)',  
          0.6, 'rgb(253, 219, 199)',
          0.8, 'rgb(239, 138, 98)',
          1, 'rgb(178, 24, 43)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          15, 20
        ]
      }
    });
  };

  const addODFlows = () => {
    if (!map.current) return;

    // Create lines for OD flows
    const flowData = {
      type: 'FeatureCollection' as const,
      features: trips.map(trip => ({
        type: 'Feature' as const,
        geometry: {
          type: 'LineString' as const,
          coordinates: [trip.origin, trip.destination]
        },
        properties: {
          count: trip.count,
          mode: trip.mode,
          purpose: trip.purpose,
          distance: trip.distance
        }
      }))
    };

    map.current.addSource('od-flows', {
      type: 'geojson',
      data: flowData
    });

    map.current.addLayer({
      id: 'flow-lines',
      type: 'line',
      source: 'od-flows',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'mode'], 'Bus'], '#1e40af',
          ['==', ['get', 'mode'], 'Metro'], '#059669', 
          ['==', ['get', 'mode'], 'Train'], '#7c3aed',
          ['==', ['get', 'mode'], 'Two-Wheeler'], '#ea580c',
          '#6b7280'
        ],
        'line-width': [
          'interpolate',
          ['linear'],
          ['get', 'count'],
          0, 1,
          200, 6
        ],
        'line-opacity': 0.7
      }
    });

    // Add trip origin points
    map.current.addLayer({
      id: 'trip-origins-points',
      type: 'circle',
      source: 'trip-origins',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'count'],
          0, 3,
          300, 12
        ],
        'circle-color': '#1e40af',
        'circle-opacity': 0.8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Add popup on click
    map.current.on('click', 'trip-origins-points', (e) => {
      if (!e.features || e.features.length === 0) return;
      
      const feature = e.features[0];
      const { count, mode, purpose } = feature.properties!;
      
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <div class="p-2">
            <strong>${count} trips</strong><br/>
            Mode: ${mode}<br/>
            Purpose: ${purpose}
          </div>
        `)
        .addTo(map.current!);
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'trip-origins-points', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'trip-origins-points', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
      initializeMap(mapboxToken.trim());
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  // Update map data when trips change
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      // Remove existing layers and sources
      try {
        if (map.current.getLayer('trip-heatmap')) {
          map.current.removeLayer('trip-heatmap');
        }
        if (map.current.getLayer('flow-lines')) {
          map.current.removeLayer('flow-lines');
        }
        if (map.current.getLayer('trip-origins-points')) {
          map.current.removeLayer('trip-origins-points');
        }
        if (map.current.getSource('trip-origins')) {
          map.current.removeSource('trip-origins');
        }
        if (map.current.getSource('od-flows')) {
          map.current.removeSource('od-flows');
        }
      } catch (error) {
        console.log('Cleanup error (expected):', error);
      }
      
      // Re-add with new data
      setTimeout(() => {
        addHeatmapLayer();
        addODFlows();
      }, 100);
    }
  }, [trips]);

  if (showTokenInput) {
    return (
      <div className="flex items-center justify-center h-full bg-card rounded-xl shadow-card">
        <div className="p-8 max-w-md w-full">
          <Alert className="mb-6">
            <AlertDescription>
              Please enter your Mapbox public token to view the interactive map. 
              Get yours at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="password"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
              />
            </div>
            <Button 
              onClick={handleTokenSubmit}
              disabled={!mapboxToken.trim()}
              className="w-full"
            >
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-card">
      {isLoading && (
        <div className="absolute inset-0 bg-card/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-xl" />
    </div>
  );
};

export default MapView;