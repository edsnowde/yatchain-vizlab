import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Filter, MapPin, Clock, Route, Target, IndianRupee } from 'lucide-react';

const FilterSidebar = () => {
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [costRange, setCostRange] = useState<number[]>([0, 500]);

  const transportModes = ['Bus', 'Metro', 'Train', 'Walk', 'Two-Wheeler', 'Car', 'Auto-Rickshaw'];
  const tripPurposes = ['Work', 'Education', 'Shopping', 'Leisure', 'Healthcare', 'Other'];
  const timeOfDayOptions = ['Early Morning (5-8 AM)', 'Morning (8-12 PM)', 'Afternoon (12-5 PM)', 'Evening (5-9 PM)', 'Night (9 PM-5 AM)'];
  const districts = ['Kochi', 'Trivandrum', 'Calicut', 'Thrissur', 'Kollam', 'Palakkad'];

  const toggleMode = (mode: string) => {
    setSelectedModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes(prev => 
      prev.includes(purpose) 
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  const toggleTimeOfDay = (time: string) => {
    setSelectedTimeOfDay(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const toggleDistrict = (district: string) => {
    setSelectedDistricts(prev => 
      prev.includes(district) 
        ? prev.filter(d => d !== district)
        : [...prev, district]
    );
  };

  const clearAllFilters = () => {
    setSelectedModes([]);
    setSelectedPurposes([]);
    setSelectedTimeOfDay([]);
    setSelectedDistricts([]);
    setCostRange([0, 500]);
  };

  return (
    <div className="w-80 bg-background border-r p-6 space-y-6 overflow-y-auto yatrachain-animate-in">
      {/* Header */}
      <Card className="yatrachain-card relative">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Filter className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold text-foreground">Smart Filters</div>
              <div className="text-sm text-muted-foreground font-normal">Configure analysis parameters</div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Transport Modes */}
      <Card className="yatrachain-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Route className="h-4 w-4" />
            Transport Modes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {transportModes.map(mode => (
              <button
                key={mode}
                onClick={() => toggleMode(mode)}
                className={`yatrachain-toggle ${selectedModes.includes(mode) ? 'active' : ''}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trip Purposes */}
      <Card className="yatrachain-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4" />
            Trip Purpose
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {tripPurposes.map(purpose => (
              <button
                key={purpose}
                onClick={() => togglePurpose(purpose)}
                className={`yatrachain-toggle ${selectedPurposes.includes(purpose) ? 'active' : ''}`}
              >
                {purpose}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time of Day */}
      <Card className="yatrachain-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Time of Day
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {timeOfDayOptions.map(time => (
              <button
                key={time}
                onClick={() => toggleTimeOfDay(time)}
                className={`yatrachain-toggle w-full text-xs ${selectedTimeOfDay.includes(time) ? 'active' : ''}`}
              >
                {time}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Districts */}
      <Card className="yatrachain-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4" />
            Districts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {districts.map(district => (
              <button
                key={district}
                onClick={() => toggleDistrict(district)}
                className={`yatrachain-toggle text-sm ${selectedDistricts.includes(district) ? 'active' : ''}`}
              >
                {district}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Range Filter */}
      <Card className="yatrachain-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <IndianRupee className="h-4 w-4" />
            Cost Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={costRange}
              onValueChange={setCostRange}
              max={500}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>₹{costRange[0]}</span>
              <span>₹{costRange[1]}+</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Filter trips by cost range to analyze spending patterns
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Active Filters Summary */}
      {(selectedModes.length > 0 || selectedPurposes.length > 0 || 
        selectedTimeOfDay.length > 0 || selectedDistricts.length > 0 || 
        costRange[0] > 0 || costRange[1] < 500) && (
        <Card className="yatrachain-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedModes.map(mode => (
                <Badge key={mode} variant="secondary" className="text-xs">
                  {mode}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => toggleMode(mode)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {selectedPurposes.map(purpose => (
                <Badge key={purpose} variant="secondary" className="text-xs">
                  {purpose}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => togglePurpose(purpose)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {selectedTimeOfDay.map(time => (
                <Badge key={time} variant="secondary" className="text-xs">
                  {time.split(' ')[0]} {time.split(' ')[1]}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => toggleTimeOfDay(time)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {selectedDistricts.map(district => (
                <Badge key={district} variant="secondary" className="text-xs">
                  {district}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => toggleDistrict(district)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {(costRange[0] > 0 || costRange[1] < 500) && (
                <Badge variant="secondary" className="text-xs">
                  ₹{costRange[0]}-₹{costRange[1]}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => setCostRange([0, 500])}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
              className="w-full text-sm yatrachain-button"
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FilterSidebar;