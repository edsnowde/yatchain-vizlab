import React from 'react';
import { Calendar, CalendarIcon, Filter, Download, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { transportModes, tripPurposes } from '@/data/mockData';

interface FilterSidebarProps {
  selectedModes: string[];
  selectedPurposes: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  onModesChange: (modes: string[]) => void;
  onPurposesChange: (purposes: string[]) => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onApplyFilters: () => void;
  onExportData: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedModes,
  selectedPurposes,
  startDate,
  endDate,
  onModesChange,
  onPurposesChange,
  onStartDateChange,
  onEndDateChange,
  onApplyFilters,
  onExportData
}) => {
  const handleModeToggle = (mode: string) => {
    const newModes = selectedModes.includes(mode)
      ? selectedModes.filter(m => m !== mode)
      : [...selectedModes, mode];
    onModesChange(newModes);
  };

  const handlePurposeToggle = (purpose: string) => {
    const newPurposes = selectedPurposes.includes(purpose)
      ? selectedPurposes.filter(p => p !== purpose)
      : [...selectedPurposes, purpose];
    onPurposesChange(newPurposes);
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Filter className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Filters & Controls</h2>
            <p className="text-sm text-muted-foreground">Configure your analysis parameters</p>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        
        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Label>
          
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "MMM dd") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={onStartDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "MMM dd") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={onEndDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Transport Modes */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">Transport Modes</Label>
          <div className="grid grid-cols-2 gap-2">
            {transportModes.map(mode => (
              <button
                key={mode}
                onClick={() => handleModeToggle(mode)}
                className={cn(
                  "yatrachain-toggle text-xs",
                  selectedModes.includes(mode) && "active"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Purposes */}
        <div className="space-y-3">
          <Label className="text-base font-semibold text-foreground">Trip Purpose</Label>
          <div className="grid grid-cols-1 gap-2">
            {tripPurposes.map(purpose => (
              <button
                key={purpose}
                onClick={() => handlePurposeToggle(purpose)}
                className={cn(
                  "yatrachain-toggle text-sm",
                  selectedPurposes.includes(purpose) && "active"
                )}
              >
                {purpose}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-border space-y-3">
        <Button 
          onClick={onApplyFilters}
          className="w-full yatrachain-button bg-gradient-primary hover:bg-primary-hover"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onExportData}
          className="w-full yatrachain-button hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default FilterSidebar;