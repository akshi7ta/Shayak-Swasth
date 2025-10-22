import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import RecordCard from "@/components/RecordCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const DoctorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mockPatients, setMockPatients] = useState<any[]>([]);
  const [mockRecords, setMockRecords] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentRecords();
  }, []);

  const fetchRecentRecords = async () => {
    const { data, error } = await api.get<any[]>("/records/");
    if (error) {
      toast.error(error);
      return;
    }
    if (data) setMockRecords(data);
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    const { data, error } = await api.get<any[]>(`/patients/search?q=${searchQuery}`);
    if (error) {
      toast.error(error);
      return;
    }
    if (data) setMockPatients(data);
    toast.info(`Found ${data?.length || 0} patients`);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title="Doctor Portal" role="doctor" notificationCount={5} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">+4 from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Records Reviewed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consultations</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Search */}
        <Card className="mb-8 shadow-soft">
          <CardHeader>
            <CardTitle>Search Patients</CardTitle>
            <CardDescription>Search by name or medical ID</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter patient name or medical ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              {mockPatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-medium transition-all cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {patient.medicalId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Last Visit</p>
                        <p className="text-sm font-semibold">{patient.lastVisit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Records */}
        <h2 className="text-2xl font-bold mb-6">Recent Patient Records</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRecords.map((record) => (
            <RecordCard
              key={record.id}
              {...record}
              onView={() => toast.info(`Viewing ${record.title}`)}
              onDownload={() => toast.info(`Downloading ${record.title}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
