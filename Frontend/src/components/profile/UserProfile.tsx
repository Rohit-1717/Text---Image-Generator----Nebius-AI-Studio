import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Mail,
  User,
  Calendar,
  LogIn,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

// Google Logo
const GoogleIcon = () => (
  <img
    src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
    alt="Google"
    className="h-4 w-4"
  />
);

function UserProfile() {
  const navigate = useNavigate();
  const { user: authUser, fetchMe, sendVerificationEmail } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      await fetchMe(); // fetch user from backend
      setLoading(false);
    };
    loadUser();
  }, [fetchMe]);

  useEffect(() => {
    if (authUser) {
      setUser({
        ...authUser,
        createdAt: authUser.createdAt || "2025-01-10T12:00:00Z",
        lastLogin: authUser.lastLogin || new Date().toISOString(),
        plan: authUser.plan || "Pro",
        status: "Active",
        emailVerified: authUser.emailVerified || false,
        loginMethod: authUser.googleId ? "Google" : "Email/Password",
      });
    }
  }, [authUser]);

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft size={18} /> Back
      </Button>

      {/* Profile Card */}
      <Card className="rounded-xl shadow-sm border p-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar */}
          {loading ? (
            <Skeleton className="h-24 w-24 rounded-full" />
          ) : (
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          {/* Name & Email */}
          <div className="text-center space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-5 w-40 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {user.name}
                </h2>
                <Badge
                  className="px-3 py-1 text-xs"
                  variant={
                    user.plan === "Premium" ? "destructive" : "secondary"
                  }
                >
                  {user.plan} Plan
                </Badge>
                <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
                  <Mail className="text-blue-500" size={16} /> {user.email}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Profile Information
          </h3>
          <div className="space-y-3">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <User size={18} className="text-purple-500" />
                  <span className="text-sm">
                    <span className="font-medium">Full Name:</span> {user.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Calendar size={18} className="text-green-500" />
                  <span className="text-sm">
                    <span className="font-medium">Joined At:</span>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <LogIn size={18} className="text-pink-500" />
                  <span className="text-sm">
                    <span className="font-medium">Last Login:</span>{" "}
                    {new Date(user.lastLogin).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Account & Security Info */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Account & Security
          </h3>
          <div className="space-y-3">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <ShieldCheck
                    size={18}
                    className={
                      user.status === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  />
                  <span className="text-sm">
                    <span className="font-medium">Account Status:</span>{" "}
                    {user.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Mail
                    size={18}
                    className={
                      user.emailVerified || user.loginMethod === "Google"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  />
                  <span className="text-sm flex items-center gap-2">
                    <span className="font-medium">Email Verified:</span>{" "}
                    {user.emailVerified || user.loginMethod === "Google" ? (
                      <Badge
                        variant="outline"
                        className="bg-green-200 text-green-900 font-bold"
                      >
                        Verified
                      </Badge>
                    ) : (
                      <>
                        <Badge
                          variant="secondary"
                          className="bg-red-200 text-red-700 font-bold"
                        >
                          Not Verified
                        </Badge>

                        {/* Only show button for non-Google users who are not verified */}
                        <Button
                          variant="default"
                          size="sm"
                          className="ml-2"
                          onClick={async () => {
                            await sendVerificationEmail();
                            await fetchMe();
                          }}
                        >
                          Verify Email
                        </Button>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <KeyRound size={18} className="text-indigo-500" />
                  <span className="text-sm flex items-center gap-2">
                    <span className="font-medium">Login Method:</span>{" "}
                    {user.loginMethod === "Google" ? (
                      <span className="flex items-center gap-1">
                        <GoogleIcon /> Google
                      </span>
                    ) : (
                      "Email/Password"
                    )}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UserProfile;
