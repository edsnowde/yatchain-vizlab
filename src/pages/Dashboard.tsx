import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import FilterSidebar from '@/components/FilterSidebar';
import GoogleMapView from '@/components/GoogleMapView';
import StatsCards from '@/components/StatsCards';
import ChartsSection from '@/components/ChartsSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import { mockTrips, getMockStats, transportModes, tripPurposes } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const timeOfDayOptions = [
  'Early Morning (5-8 AM)',
  'Morning (8-12 PM)',
  'Afternoon (12-5 PM)',
  'Evening (5-9 PM)',
  'Night (9 PM-5 AM)'
];
const districts = ['Kochi', 'Trivandrum', 'Calicut', 'Thrissur', 'Kollam', 'Palakkad'];

const Dashboard = () => {
  const [selectedModes, setSelectedModes] = useState<string[]>(transportModes);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(tripPurposes);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [costRange, setCostRange] = useState<number[]>([0, 500]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const filteredTrips = useMemo(() => {
    let filtered = mockTrips;
    if (selectedModes.length > 0) filtered = filtered.filter(trip => selectedModes.includes(trip.mode));
    if (selectedPurposes.length > 0) filtered = filtered.filter(trip => selectedPurposes.includes(trip.purpose));
    if (costRange[0] > 0 || costRange[1] < 500) filtered = filtered.filter(trip => trip.cost >= costRange[0] && trip.cost <= costRange[1]);
    return filtered;
  }, [selectedModes, selectedPurposes, selectedTimeOfDay, selectedDistricts, costRange, startDate, endDate]);

  const stats = useMemo(() => getMockStats(filteredTrips), [filteredTrips]);

  const handleApplyFilters = () => {
    toast({
      title: "Filters Applied",
      description: `Showing ${filteredTrips.length} filtered trip patterns with ${stats.totalTrips} total trips.`,
    });
  };

  const handleExportData = () => {
    const headers = ['Origin Lat', 'Origin Lng', 'Dest Lat', 'Dest Lng', 'Mode', 'Purpose', 'Distance (km)', 'Trip Count'];
    const csvContent = [
      headers.join(','),
      ...filteredTrips.map(trip => [
        trip.origin[1], trip.origin[0], trip.destination[1], trip.destination[0],
        trip.mode, trip.purpose, trip.distance, trip.count
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yatrachain-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: `Successfully exported ${filteredTrips.length} trip records to CSV.`,
    });
  };

  const toggleMode = (mode: string) => setSelectedModes(prev => prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]);
  const togglePurpose = (purpose: string) => setSelectedPurposes(prev => prev.includes(purpose) ? prev.filter(p => p !== purpose) : [...prev, purpose]);
  const toggleTimeOfDay = (time: string) => setSelectedTimeOfDay(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);
  const toggleDistrict = (district: string) => setSelectedDistricts(prev => prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]);
  const clearAllFilters = () => {
    setSelectedModes(transportModes);
    setSelectedPurposes(tripPurposes);
    setSelectedTimeOfDay([]);
    setSelectedDistricts([]);
    setCostRange([0, 500]);
  };

  return (
    <motion.div
      className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b px-6 py-4 bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900">Mobility Dashboard</h1>
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <FilterSidebar
          selectedModes={selectedModes}
          selectedPurposes={selectedPurposes}
          selectedTimeOfDay={selectedTimeOfDay}
          selectedDistricts={selectedDistricts}
          costRange={costRange}
          onToggleMode={toggleMode}
          onTogglePurpose={togglePurpose}
          onToggleTimeOfDay={toggleTimeOfDay}
          onToggleDistrict={toggleDistrict}
          onCostRangeChange={setCostRange}
          onClearAll={clearAllFilters}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stats Cards */}
          <div className="px-6 pt-6 pb-4">
            <StatsCards stats={stats} />
          </div>

          {/* Map + Charts Panel */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto space-y-6">
            
            {/* Map Card */}
            <motion.div whileHover={{ scale: 1.02 }} className="w-full h-[600px] bg-white rounded-3xl shadow-lg p-4 transition-shadow duration-300">
              <GoogleMapView trips={filteredTrips} />
            </motion.div>

            {/* Charts Card */}
            <motion.div whileHover={{ scale: 1.01 }} className="w-full bg-white rounded-3xl shadow-lg p-6 transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-indigo-800 mb-4">Trip Analytics</h2>
              <ChartsSection stats={stats} />
            </motion.div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
