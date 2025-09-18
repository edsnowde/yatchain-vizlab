import React, { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, FileText, Database, Calendar, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock aggregated trip data
const mockAggregatedData = [
  {
    id: 'AGG001',
    route: 'Ernakulam → Kakkanad',
    mode: 'Bus',
    purpose: 'Work',
    tripCount: 245,
    avgDistance: 12.5,
    avgDuration: 35,
    avgCost: 18,
    totalCost: 4410,
    peakHour: '8:30 AM',
  },
  {
    id: 'AGG002',
    route: 'Kakkanad → Ernakulam',
    mode: 'Bus', 
    purpose: 'Work',
    tripCount: 189,
    avgDistance: 12.5,
    avgDuration: 38,
    avgCost: 18,
    totalCost: 3402,
    peakHour: '6:00 PM',
  },
  {
    id: 'AGG003',
    route: 'Trivandrum → Technopark',
    mode: 'Metro',
    purpose: 'Work',
    tripCount: 167,
    avgDistance: 15.8,
    avgDuration: 25,
    avgCost: 25,
    totalCost: 4175,
    peakHour: '8:45 AM',
  },
  {
    id: 'AGG004',
    route: 'Calicut → Cyberpark',
    mode: 'Two-Wheeler',
    purpose: 'Work',
    tripCount: 134,
    avgDistance: 8.9,
    avgDuration: 20,
    avgCost: 35,
    totalCost: 4690,
    peakHour: '9:00 AM',
  },
];

const Export = () => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('all');
  const [mode, setMode] = useState('all');
  const [purpose, setPurpose] = useState('all');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(mockAggregatedData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (rowId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, rowId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    }
  };

  const handleExport = () => {
    const selectedData = mockAggregatedData.filter(row => selectedRows.includes(row.id));
    
    if (selectedData.length === 0) {
      toast({
        title: "No data selected",
        description: "Please select at least one row to export.",
        variant: "destructive"
      });
      return;
    }

    let content: string;
    let mimeType: string;
    let extension: string;

    if (selectedFormat === 'csv') {
      const headers = ['Route', 'Mode', 'Purpose', 'Trip Count', 'Avg Distance (km)', 'Avg Duration (min)', 'Peak Hour'];
      const csvRows = selectedData.map(row => [
        row.route,
        row.mode,
        row.purpose,
        row.tripCount,
        row.avgDistance,
        row.avgDuration,
        row.peakHour
      ]);
      content = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
      mimeType = 'text/csv';
      extension = 'csv';
    } else {
      content = JSON.stringify(selectedData, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yatrachain-export-${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${selectedData.length} records as ${selectedFormat.toUpperCase()} file.`,
    });
  };

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
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Export & Reports</h1>
            <Breadcrumbs />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto space-y-6">
        {/* Export Options */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Export Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Excel Compatible)</SelectItem>
                  <SelectItem value="json">JSON (Developer Format)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Data Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Transport Mode</label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="metro">Metro</SelectItem>
                    <SelectItem value="two-wheeler">Two-Wheeler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Privacy & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  All exported data is anonymized and aggregated (K ≥ 10) to protect individual privacy.
                </p>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  <li>No personal identifiers included</li>
                  <li>Location data rounded to protect privacy</li>
                  <li>Minimum aggregation threshold applied</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Aggregated Trip Data ({mockAggregatedData.length} records)</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedRows.length} selected
                </span>
                <Button onClick={handleExport} disabled={selectedRows.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedRows.length === mockAggregatedData.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Trip Count</TableHead>
                  <TableHead>Avg Distance</TableHead>
                  <TableHead>Avg Duration</TableHead>
                  <TableHead>Avg Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Peak Hour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAggregatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedRows.includes(row.id)}
                        onCheckedChange={(checked) => handleRowSelect(row.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{row.route}</TableCell>
                    <TableCell>
                      <Badge className={getModeColor(row.mode)}>
                        {row.mode}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.purpose}</TableCell>
                    <TableCell>{row.tripCount.toLocaleString()}</TableCell>
                    <TableCell>{row.avgDistance} km</TableCell>
                    <TableCell>{row.avgDuration} min</TableCell>
                    <TableCell className="text-primary font-semibold">₹{row.avgCost}</TableCell>
                    <TableCell className="text-primary font-semibold">₹{row.totalCost.toLocaleString()}</TableCell>
                    <TableCell>{row.peakHour}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Export History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Exports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Trip Data Export</p>
                  <p className="text-sm text-muted-foreground">245 records • CSV format • Sept 17, 2024</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Re-download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Analytics Report</p>
                  <p className="text-sm text-muted-foreground">Full dataset • JSON format • Sept 16, 2024</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Re-download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Export;