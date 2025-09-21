import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Chrome, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom"; 
import useSessionStore from "@/store/useSessionStore";

export const SecurityTab: React.FC = () => {
  const { sessions, fetchSessions, deleteSession, logoutAll, loading } =
    useSessionStore();
  const navigate = useNavigate();

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Handle logout all + redirect
  const handleLogoutAll = async () => {
    await logoutAll();
    navigate("/login"); // ✅ redirect
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <ShieldCheck className="text-green-500" size={18} /> Security
      </h2>

      {/* Example login method – can be dynamic */}
      <p className="flex items-center gap-2">
        <img
          src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
          alt="Google"
          className="h-5"
        />{" "}
        Login Method: Google
      </p>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Active Sessions</h3>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active sessions found.
          </p>
        ) : (
          sessions.map((s) => (
            <div
              key={s.sessionId}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-2 text-sm">
                {/* Dynamically pick icon */}
                {s.device?.toLowerCase().includes("iphone") ? (
                  <Smartphone size={18} className="text-blue-500" />
                ) : (
                  <Chrome size={18} className="text-orange-500" />
                )}
                <span>
                  {s.device || s.browser || "Unknown"} •{" "}
                  {s.location || "Unknown"}
                </span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteSession(s.sessionId)}
              >
                Logout
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Logout all devices */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-2">
            <AlertTriangle size={16} /> Logout from All Devices
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Logging out from all devices will end every active session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive" onClick={handleLogoutAll}>
              Logout All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
