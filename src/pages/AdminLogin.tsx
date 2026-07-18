import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function AdminLogin() {
  const { isLoading: authLoading, isAuthenticated, signIn, signOut, user } = useAuth();
  const promoteMeToAdmin = useMutation(api.admin.promoteMeToAdmin);
  const adminStatus = useQuery(api.admin.isAdmin);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoting, setPromoting] = useState(false);

  // If already admin, redirect to dashboard
  useEffect(() => {
    if (!authLoading && adminStatus === true) {
      navigate("/admin");
    }
  }, [authLoading, adminStatus, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("email", email);
      await signIn("email-otp", formData);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("code", otp);
      await signIn("email-otp", formData);

      // Now promote the user to admin
      setPromoting(true);
      const result = await promoteMeToAdmin();
      if (result.success) {
        navigate("/admin");
      } else {
        setError(result.message);
        await signOut();
      }
    } catch (err: any) {
      setError("Invalid verification code. Please try again.");
      setOtp("");
    } finally {
      setIsLoading(false);
      setPromoting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
      <Card className="w-full max-w-sm shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-zinc-100 dark:text-zinc-900" />
            </div>
          </div>
          <CardTitle className="text-xl">LINE17 STUDIO</CardTitle>
          <CardDescription>Admin sign in with email</CardDescription>
        </CardHeader>

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    disabled={isLoading}
                    required
                    autoFocus
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 px-3 py-2 rounded-md">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading || !email}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending code...</>
                ) : (
                  <><ArrowRight className="mr-2 h-4 w-4" /> Send verification code</>
                )}
              </Button>
            </CardContent>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-zinc-500">
                  Enter the code sent to <strong className="text-zinc-700">{email}</strong>
                </p>
              </div>
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="code" value={otp} />
              <div className="flex justify-center">
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 px-3 py-2 rounded-md text-center">
                  {error}
                </p>
              )}
              {promoting && (
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Granting admin access...
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  "Verify & Sign In"
                )}
              </Button>
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-xs text-zinc-400"
                  onClick={() => { setStep("email"); setError(null); setOtp(""); }}
                  disabled={isLoading}
                >
                  Use a different email
                </Button>
              </div>
            </CardContent>
          </form>
        )}

        <div className="pb-4 px-6 text-xs text-center text-zinc-400">
          Sign in with your email to access the admin panel.
          <br />
          First-time admins will be promoted automatically.
        </div>
      </Card>
    </div>
  );
}
