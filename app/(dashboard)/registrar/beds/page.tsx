"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/lib/auth/roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconSearch, IconBed, IconRefresh } from '@tabler/icons-react';

interface Bed {
  id: string;
  unit: string;
  roomNumber: string | null;
  bedNumber: string | null;
  status: string;
  department?: {
    id: string;
    name: string;
  } | null;
  encounters: Array<{
    patient: {
      id: string;
      firstName: string;
      lastName: string;
      mrn: string;
    };
  }>;
}

interface UnitOption {
  unit: string;
  availableCount: number;
}

export default function BedManagementPage() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('AVAILABLE');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>('');

  // Fetch beds
  const fetchBeds = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedUnit !== 'all') params.set('unit', selectedUnit);
      params.set('status', selectedStatus);

      const response = await fetch(`/api/beds/search?${params.toString()}`);
      
      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        setError(`Failed to fetch beds: ${response.status}`);
        return;
      }

      // Check if response has content
      const text = await response.text();
      if (!text) {
        console.error('Empty response from API');
        setError('Received empty response from server');
        return;
      }

      const data = JSON.parse(text);
      
      if (data.error) {
        console.error('Error:', data.error);
        setError(data.error);
        return;
      }

      setBeds(data.beds || []);
      setUnits(data.units || []);
    } catch (error) {
      console.error('Failed to fetch beds:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, [selectedUnit, selectedStatus]);

  // Filter beds by search term
  const filteredBeds = beds.filter(bed => 
    bed.bedNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bed.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bed.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-500 hover:bg-green-600';
      case 'OCCUPIED': return 'bg-red-500 hover:bg-red-600';
      case 'CLEANING': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'OUT_OF_SERVICE': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const formatBedLabel = (bed: Bed) => {
    const parts = [];
    if (bed.roomNumber) parts.push(`Room ${bed.roomNumber}`);
    if (bed.bedNumber) parts.push(`Bed ${bed.bedNumber}`);
    return parts.join(' - ') || 'N/A';
  };

  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Bed Management</h1>
            <p className="text-muted-foreground">
              Search for available beds across inpatient units for patient admission and transfers
            </p>
          </div>

          <div className="px-4 lg:px-6 space-y-6">
            {/* Error Display */}
            {error && (
              <Card className="border-red-500">
                <CardContent className="pt-6">
                  <p className="text-red-500 text-sm">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Search Filters</CardTitle>
                <CardDescription>Filter beds by unit, status, and room/bed number</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Unit Filter */}
                  <div className="space-y-2">
                    <Label>Inpatient Unit</Label>
                    <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Units</SelectItem>
                        {units.map(unit => (
                          <SelectItem key={unit.unit} value={unit.unit}>
                            {unit.unit} ({unit.availableCount} available)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label>Bed Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="OCCUPIED">Occupied</SelectItem>
                        <SelectItem value="CLEANING">Cleaning</SelectItem>
                        <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search */}
                  <div className="space-y-2">
                    <Label>Search Room/Bed</Label>
                    <div className="relative">
                      <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Room or bed number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  {/* Refresh Button */}
                  <div className="space-y-2">
                    <Label className="opacity-0">Refresh</Label>
                    <Button onClick={fetchBeds} disabled={loading} className="w-full">
                      <IconRefresh className="mr-2 h-4 w-4" />
                      {loading ? 'Searching...' : 'Refresh'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {filteredBeds.length} Bed{filteredBeds.length !== 1 ? 's' : ''} Found
                </CardTitle>
                <CardDescription>
                  {selectedStatus === 'AVAILABLE' 
                    ? 'Available beds ready for admission or transfer' 
                    : `Beds with status: ${selectedStatus}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <IconBed className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                    <p>Loading beds...</p>
                  </div>
                ) : filteredBeds.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <IconBed className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No beds found</p>
                    <p className="text-sm">Try adjusting your search filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBeds.map(bed => (
                      <Card key={bed.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <IconBed className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-lg">
                                  {formatBedLabel(bed)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {bed.unit}
                                </p>
                                {bed.department && (
                                  <p className="text-xs text-muted-foreground">
                                    {bed.department.name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge className={getStatusColor(bed.status)}>
                              {bed.status}
                            </Badge>
                          </div>
                          
                          {bed.encounters?.[0]?.patient && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-xs text-muted-foreground mb-1">Current Patient:</p>
                              <p className="font-medium text-sm">
                                {bed.encounters[0].patient.firstName} {bed.encounters[0].patient.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                MRN: {bed.encounters[0].patient.mrn}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}