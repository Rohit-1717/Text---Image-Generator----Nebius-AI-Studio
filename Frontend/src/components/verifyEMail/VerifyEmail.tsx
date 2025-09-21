import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/store/useAuthStore";

const VerifyEmail: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const sendVerificationEmail = useAuthStore(
    (state) => state.sendVerificationEmail
  );

  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  // Only show once per session
  const SESSION_KEY = "verifyEmailDialogClosed";

  useEffect(() => {
    const closed = sessionStorage.getItem(SESSION_KEY);
    if (user && !user.emailVerified && !closed) {
      setOpen(true);
    }
  }, [user]);

  const handleSendVerification = async () => {
    setSending(true);
    try {
      await sendVerificationEmail();
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  };

  // Show skeleton while user data is loading
  if (loading || !user) {
    return (
      <div className="p-4">
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  // Remove the positioning wrapper - Dialog handles its own positioning
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Email Verification Required</DialogTitle>
          <DialogDescription>
            Your email is not verified. Please verify your email to access all
            features.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive" className="my-4">
          <AlertTitle>Unverified Email</AlertTitle>
          <AlertDescription>
            You must verify your email to continue using the dashboard.
          </AlertDescription>
        </Alert>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={sending}>
            Close
          </Button>
          <Button onClick={handleSendVerification} disabled={sending}>
            {sending ? "Sending..." : "Send Verification Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyEmail;