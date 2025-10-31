import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, ArrowLeft, Phone, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";


const Auth = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    const { error } = await api.post("/auth/send-otp", { phone: phoneNumber });
    if (error) {
      toast.error(error);
      return;
    }
    setOtpSent(true);
    toast.success("OTP sent to your phone!");
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
   
    api.setToken(data.access_token);
    localStorage.setItem("userRole", data.role);
    toast.success("Login successful!");
    navigate(`/${data.role.replace("_", "-")}`);
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    const { data, error } = await api.post<{ access_token: string; role: string }>("/auth/login", { email, password });
    if (error || !data) {
      toast.error(error || "Invalid credentials");
      return;
    }
    api.setToken(data.access_token);
    localStorage.setItem("userRole", data.role);
    toast.success("Login successful!");
    navigate(`/${data.role.replace("_", "-")}`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4 text-white hover:text-white/80"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="shadow-strong animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Activity className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your healthcare dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="phone">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4">
                {!otpSent ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleSendOTP}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Send OTP
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        OTP sent to {phoneNumber}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setOtpSent(false)}
                        className="flex-1"
                      >
                        Change Number
                      </Button>
                      <Button
                        onClick={handleVerifyOTP}
                        className="flex-1"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Verify
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      className="w-full"
                      onClick={handleSendOTP}
                    >
                      Resend OTP
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleEmailLogin}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                Don't have an account?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/signup")}>
                  Sign up
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
