import React, { useState, useMemo } from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import GoogleMapView from '@/components/GoogleMapView';
import StatsCards from '@/components/StatsCards';
import ChartsSection from '@/components/ChartsSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import { mockTrips, getMockStats, transportModes, tripPurposes } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [selectedModes, setSelectedModes] = useState<string[]>(transportModes);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(tripPurposes);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Filter trips based on selected criteria
  const filteredTrips = useMemo(() => {
    let filtered = mockTrips;

    if (selectedModes.length > 0) {
      filtered = filtered.filter(trip => selectedModes.includes(trip.mode));
    }

    if (selectedPurposes.length > 0) {
      filtered = filtered.filter(trip => selectedPurposes.includes(trip.purpose));
    }

    return filtered;
  }, [selectedModes, selectedPurposes, startDate, endDate]);

  // Calculate statistics from filtered trips
  const stats = useMemo(() => getMockStats(filteredTrips), [filteredTrips]);

  const handleApplyFilters = () => {
    toast({
      title: "Filters Applied",
      description: `Showing ${filteredTrips.length} filtered trip patterns with ${stats.totalTrips} total trips.`,
    });
  };

  const handleExportData = () => {
    // Generate CSV content
    const headers = ['Origin Lat', 'Origin Lng', 'Dest Lat', 'Dest Lng', 'Mode', 'Purpose', 'Distance (km)', 'Trip Count'];
    const csvContent = [
      headers.join(','),
      ...filteredTrips.map(trip => [
        trip.origin[1],
        trip.origin[0], 
        trip.destination[1],
        trip.destination[0],
        trip.mode,
        trip.purpose,
        trip.distance,
        trip.count
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `yatrachain-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Data Exported", 
      description: `Successfully exported ${filteredTrips.length} trip records to CSV.`,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mobility Dashboard</h1>
            <Breadcrumbs />
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Filter Sidebar */}
        <FilterSidebar
          selectedModes={selectedModes}
          selectedPurposes={selectedPurposes}
          startDate={startDate}
          endDate={endDate}
          onModesChange={setSelectedModes}
          onPurposesChange={setSelectedPurposes}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApplyFilters={handleApplyFilters}
          onExportData={handleExportData}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stats Cards */}
          <div className="p-6 pb-4">
            <StatsCards stats={stats} />
          </div>

          {/* Main Panel: Map and Charts with better spacing */}
          <div className="flex-1 px-6 pb-6 grid grid-cols-1 xl:grid-cols-5 gap-6 min-h-0">
            {/* Map Section - More space */}
            <div className="xl:col-span-3">
              <div className="h-full min-h-[600px]">
                <GoogleMapView trips={filteredTrips} />
              </div>
            </div>

            {/* Charts Section - Better proportioned */}
            <div className="xl:col-span-2">
              <div className="h-full min-h-[600px]">
                <ChartsSection stats={stats} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;