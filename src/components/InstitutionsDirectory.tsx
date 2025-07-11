
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Building2, Search } from 'lucide-react';

export const InstitutionsDirectory = () => {
  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paidFilter, setPaidFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    filterInstitutions();
  }, [institutions, searchTerm, paidFilter]);

  const fetchInstitutions = async () => {
    try {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      if (data) {
        setInstitutions(data);
        setFilteredInstitutions(data);
      }
    } catch (error) {
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInstitutions = () => {
    let filtered = institutions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((institution: any) =>
        institution.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.services?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by paid/free
    if (paidFilter !== 'all') {
      const isPaid = paidFilter === 'paid';
      filtered = filtered.filter((institution: any) => institution.paid === isPaid);
    }

    setFilteredInstitutions(filtered);
  };

  if (loading) {
    return <div className="text-center text-foreground py-8">Loading institutions...</div>;
  }

  return (
    <div className="space-y-6 bg-muted">
      <div>
        <h2 className="text-2xl font-bold text-primary">Institutions Directory</h2>
        <p className="text-muted-foreground">Find local resources and support services</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search institutions, locations, or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={paidFilter} onValueChange={setPaidFilter}>
          <SelectTrigger className="w-48 bg-background text-foreground border-border">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground border-border">
            <SelectItem className="bg-background text-foreground border-border" value="all">All Services</SelectItem>
            <SelectItem className="bg-background text-foreground border-border" value="free">Free Services</SelectItem>
            <SelectItem className="bg-background text-foreground border-border" value="paid">Paid Services</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInstitutions.map((institution: any) => (
          <Card key={institution.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {institution.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {institution.location}
                  </CardDescription>
                </div>
                <Badge variant={institution.paid ? "default" : "secondary"}>
                  {institution.paid ? 'Paid' : 'Free'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1">Services</h4>
                  <p className="text-sm text-gray-600">{institution.services}</p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {institution.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{institution.phone}</span>
                    </div>
                  )}
                  {institution.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{institution.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button size="sm" className="w-full">
                    Contact Institution
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInstitutions.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No institutions found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};
