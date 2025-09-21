import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, HelpCircle, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useSupportStore from "@/store/useSupportStore";

export const SupportTab: React.FC = () => {
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { submitReport, loading, success } = useSupportStore();

  // Auto-close dialog when success changes to true
  useEffect(() => {
    if (success) {
      setDescription("");
      setOpen(false);
    }
  }, [success]);

  const handleReportSubmit = async () => {
    await submitReport(description);
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <HelpCircle className="text-pink-500" size={18} /> Support
      </h2>

      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => window.open("/userFaqs", "_blank")}
      >
        <HelpCircle size={16} /> Help & FAQs
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() =>
          (window.location.href =
            "mailto:rohit.developer0523@gmail.com?subject=Support Request")
        }
      >
        <Mail size={16} /> Contact Support
      </Button>

      {/* Report a Problem Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <AlertTriangle size={16} /> Report a Problem
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Report a Problem</DialogTitle>
            <DialogDescription>
              Please provide a brief description of the issue. Our support team
              will review it shortly. You can also contact us directly at{" "}
              <strong>rohit.developer0523@gmail.com</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Textarea
              ref={textareaRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem..."
              rows={5}
              disabled={loading} // optional: disable while submitting
            />
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="default"
              onClick={handleReportSubmit}
              disabled={loading || !description.trim()}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
