// Mock transportation data for Kerala
export interface TripData {
  id: string;
  origin: [number, number]; // [lng, lat]
  destination: [number, number];
  mode: string;
  purpose: string;
  distance: number;
  duration: number;
  timestamp: string;
  count: number; // aggregated trip count
}

export interface StatsData {
  totalTrips: number;
  avgDistance: number;
  peakHour: string;
  modeShare: { [key: string]: number };
}

// Kerala coordinates - centered on Kochi
export const keralaCenter: [number, number] = [76.2673, 9.9312];

// Mock trip data for Kerala cities
export const mockTrips: TripData[] = [
  // Kochi area trips
  {
    id: "1",
    origin: [76.2673, 9.9312], // Kochi
    destination: [76.2144, 9.9816], // Kochi Metro
    mode: "Metro",
    purpose: "Work",
    distance: 12.5,
    duration: 35,
    timestamp: "2024-09-17T08:30:00Z",
    count: 245
  },
  {
    id: "2", 
    origin: [76.2711, 9.9252], // Ernakulam
    destination: [76.3127, 9.9816], // Kakkanad
    mode: "Bus",
    purpose: "Work", 
    distance: 18.2,
    duration: 45,
    timestamp: "2024-09-17T09:15:00Z",
    count: 189
  },
  // Trivandrum area
  {
    id: "3",
    origin: [76.9366, 8.5241], // Trivandrum
    destination: [76.9558, 8.5569], // Technopark
    mode: "Bus",
    purpose: "Work",
    distance: 15.8,
    duration: 40,
    timestamp: "2024-09-17T08:45:00Z", 
    count: 167
  },
  // Calicut area
  {
    id: "4",
    origin: [75.7804, 11.2588], // Calicut
    destination: [75.8314, 11.2968], // Cyberpark
    mode: "Two-Wheeler",
    purpose: "Work",
    distance: 8.9,
    duration: 25,
    timestamp: "2024-09-17T09:00:00Z",
    count: 134
  },
  // Inter-city trips
  {
    id: "5",
    origin: [76.2673, 9.9312], // Kochi
    destination: [76.9366, 8.5241], // Trivandrum
    mode: "Train",
    purpose: "Leisure",
    distance: 220.5,
    duration: 240,
    timestamp: "2024-09-17T14:30:00Z",
    count: 89
  },
  {
    id: "6",
    origin: [75.7804, 11.2588], // Calicut  
    destination: [76.2673, 9.9312], // Kochi
    mode: "Bus",
    purpose: "Education",
    distance: 195.3,
    duration: 180,
    timestamp: "2024-09-17T07:00:00Z",
    count: 76
  }
];

export const getMockStats = (filteredTrips: TripData[]): StatsData => {
  const totalTrips = filteredTrips.reduce((sum, trip) => sum + trip.count, 0);
  const avgDistance = filteredTrips.length > 0 
    ? filteredTrips.reduce((sum, trip) => sum + trip.distance * trip.count, 0) / totalTrips
    : 0;
  
  // Calculate mode share
  const modeCount: { [key: string]: number } = {};
  filteredTrips.forEach(trip => {
    modeCount[trip.mode] = (modeCount[trip.mode] || 0) + trip.count;
  });

  const modeShare: { [key: string]: number } = {};
  Object.keys(modeCount).forEach(mode => {
    modeShare[mode] = Math.round((modeCount[mode] / totalTrips) * 100);
  });

  return {
    totalTrips,
    avgDistance: Math.round(avgDistance * 10) / 10,
    peakHour: "8:30 AM",
    modeShare
  };
};

// Chart data generators
export const getHourlyData = () => [
  { hour: '6 AM', trips: 45 },
  { hour: '7 AM', trips: 123 },
  { hour: '8 AM', trips: 267 },
  { hour: '9 AM', trips: 245 },
  { hour: '10 AM', trips: 89 },
  { hour: '11 AM', trips: 76 },
  { hour: '12 PM', trips: 134 },
  { hour: '1 PM', trips: 156 },
  { hour: '2 PM', trips: 98 },
  { hour: '3 PM', trips: 112 },
  { hour: '4 PM', trips: 187 },
  { hour: '5 PM', trips: 234 },
  { hour: '6 PM', trips: 298 },
  { hour: '7 PM', trips: 189 },
  { hour: '8 PM', trips: 134 },
  { hour: '9 PM', trips: 87 }
];

export const getPurposeData = () => [
  { purpose: 'Work', value: 45, color: '#1e40af' },
  { purpose: 'Education', value: 25, color: '#059669' },
  { purpose: 'Shopping', value: 15, color: '#ea580c' },
  { purpose: 'Leisure', value: 10, color: '#7c3aed' },
  { purpose: 'Other', value: 5, color: '#dc2626' }
];

export const transportModes = [
  'Bus', 'Metro', 'Train', 'Walk', 'Two-Wheeler', 'Car', 'Auto-Rickshaw'
];

export const tripPurposes = [
  'Work', 'Education', 'Shopping', 'Leisure', 'Healthcare', 'Other'
];