import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";

import NavBar from "@/components/nav/Navbar";
import Footer from "@/components/footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import useAuthStore from "@/store/useAuthStore";
import { CopyButton } from "@/components/copyButton/CopyButton";

// -------- Form Schema --------
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;


// ---------- Test Credentials Card Component ----------
function TestCredentialsCard() {
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(true);

  const TEST_EMAIL = import.meta.env.VITE_TEST_EMAIL || "test@morphix.ai";
  const TEST_PASSWORD = import.meta.env.VITE_TEST_PASSWORD || "password123";

  // Show card automatically
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowCard(true);
    }, 1000); // 2s skeleton loader

    return () => clearTimeout(timer);
  }, []);

  if (!showCard) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-[90%] max-w-xs sm:max-w-sm md:max-w-[20rem]">
      <Card className="relative p-3 sm:p-4 space-y-2 sm:space-y-3 shadow-md">
        {/* Close Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 p-1"
          onClick={() => setShowCard(false)}
        >
          <span className="sr-only">Close</span>✕
        </Button>

        {loading ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Loading test credentials...</p>
            <Skeleton className="h-3 w-40 sm:h-4 sm:w-48" />
            <Skeleton className="h-3 w-32 sm:h-4 sm:w-40" />
          </div>
        ) : (
          <>
            <p className="text-sm font-medium">You can test Morphix using:</p>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Email</Label>
              <div className="flex items-center justify-between gap-2 border border-input rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-background">
                <span className="truncate text-sm">{TEST_EMAIL}</span>
                <CopyButton text={TEST_EMAIL} />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs">Password</Label>
              <div className="flex items-center justify-between gap-2 border border-input rounded-md px-2 sm:px-3 py-1.5 sm:py-2 bg-background">
                <span className="truncate text-sm">{TEST_PASSWORD}</span>
                <CopyButton text={TEST_PASSWORD} />
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Or sign in quickly with{" "}
              <span className="font-medium">Google ✨</span>
            </p>
          </>
        )}
      </Card>
    </div>
  );
}

// ---------- Main Login Component ----------
export default function Login() {
  const { login, loginWithGoogle, loading, user } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect once user is logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <>
      <NavBar />
      {/* Test Credentials Card */}
      <TestCredentialsCard />

      <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-92 m-auto h-fit w-full"
        >
          <div className="p-6">
            <div>
              <a href="/" aria-label="go home">
                <img
                  src="/logo.webp"
                  alt="Morphix Logo"
                  className="h-10 w-auto"
                />
              </a>
              <h1 className="mb-1 mt-4 text-xl font-semibold">
                Sign In to Morphix
              </h1>
              <p>Welcome back! Sign in to continue</p>
            </div>

            {/* Google OAuth */}
            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={loginWithGoogle}
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.98em"
                  height="1em"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285f4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  />
                  <path
                    fill="#34a853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  />
                  <path
                    fill="#fbbc05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  />
                  <path
                    fill="#eb4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>

            {/* Divider */}
            <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <hr className="border-dashed" />
              <span className="text-muted-foreground text-xs">
                Or continue with
              </span>
              <hr className="border-dashed" />
            </div>

            {/* Email / Password */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="block text-sm">
                  Enter your email
                </Label>
                <Input type="email" {...register("email")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="block text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </div>

          <p className="text-accent-foreground text-center text-sm">
            Don't have an account?
            <Button asChild variant="link" className="px-2">
              <a href="/signup">Create account</a>
            </Button>
          </p>
        </form>
      </section>
      <Footer />
    </>
  );
}
