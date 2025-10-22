import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Shield, UserCog, FileText, Search, Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: "patient",
      title: "Patient",
      description: "View your medical records, upload reports, and manage access",
      icon: Activity,
      color: "primary",
      path: "/patient",
    },
    {
      id: "doctor",
      title: "Doctor",
      description: "Search patients, view records, and provide diagnoses",
      icon: Users,
      color: "secondary",
      path: "/doctor",
    },
    {
      id: "hospital_manager",
      title: "Hospital Manager",
      description: "Manage all records with secure OTP verification",
      icon: UserCog,
      color: "accent",
      path: "/hospital-manager",
    },
    {
      id: "admin",
      title: "Admin",
      description: "System administration and audit monitoring",
      icon: Shield,
      color: "destructive",
      path: "/admin",
    },
  ];

  const handleRoleSelect = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">HealthCare Portal</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            <Lock className="mr-2 h-4 w-4" />
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="animate-fade-in">
          <h2 className="text-5xl font-bold text-white mb-4">
            Secure Healthcare Management
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Advanced patient record management with AI-powered insights, role-based access,
            and complete audit transparency.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              <FileText className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Search className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          Access by Role
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="hover:shadow-strong transition-all cursor-pointer animate-fade-in border-2 hover:border-primary"
                onClick={() => handleRoleSelect(role.path)}
              >
                <CardHeader>
                  <div className="mb-4">
                    <Icon className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Security Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-card rounded-2xl p-8 shadow-strong">
          <h3 className="text-3xl font-bold text-center mb-8">
            Enterprise-Grade Security
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">OTP Verification</h4>
              <p className="text-muted-foreground">
                Multi-factor authentication for all sensitive operations
              </p>
            </div>
            <div className="text-center">
              <FileText className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Audit Logs</h4>
              <p className="text-muted-foreground">
                Complete transparency with detailed access tracking
              </p>
            </div>
            <div className="text-center">
              <Search className="h-12 w-12 text-accent mx-auto mb-4" />
              <h4 className="font-semibold mb-2">AI-Powered Search</h4>
              <p className="text-muted-foreground">
                Semantic search across medical records and reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 HealthCare Portal. Secure. Compliant. Professional.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
