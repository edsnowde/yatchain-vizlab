import React from 'react';
import { TrendingUp, MapPin, IndianRupee, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsData } from '@/data/mockData';

interface StatsCardsProps {
  stats: StatsData;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const topMode = Object.entries(stats.modeShare).reduce((a, b) => 
    stats.modeShare[a[0]] > stats.modeShare[b[0]] ? a : b
  )[0] || 'N/A';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Trips */}
      <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-surface">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Trips
          </CardTitle>
          <div className="p-2 bg-chart-blue/10 rounded-lg group-hover:bg-chart-blue/20 transition-colors">
            <TrendingUp className="h-4 w-4 text-chart-blue" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(stats.totalTrips)}
          </div>
          <p className="text-xs text-muted-foreground">
            Aggregated trips (K ≥ 10)
          </p>
        </CardContent>
      </Card>

      {/* Average Distance */}
      <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-surface">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg. Distance
          </CardTitle>
          <div className="p-2 bg-chart-green/10 rounded-lg group-hover:bg-chart-green/20 transition-colors">
            <MapPin className="h-4 w-4 text-chart-green" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats.avgDistance} km
          </div>
          <p className="text-xs text-muted-foreground">
            Per trip average
          </p>
        </CardContent>
      </Card>

      {/* Average Cost */}
      <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-surface">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg. Cost
          </CardTitle>
          <div className="p-2 bg-chart-orange/10 rounded-lg group-hover:bg-chart-orange/20 transition-colors">
            <IndianRupee className="h-4 w-4 text-chart-orange" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ₹{stats.avgCost}
          </div>
          <p className="text-xs text-muted-foreground">
            Per trip average
          </p>
        </CardContent>
      </Card>

      {/* Top Mode */}
      <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-surface">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Mode
          </CardTitle>
          <div className="p-2 bg-chart-purple/10 rounded-lg group-hover:bg-chart-purple/20 transition-colors">
            <Share2 className="h-4 w-4 text-chart-purple" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {topMode}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.modeShare[topMode] || 0}% share
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;