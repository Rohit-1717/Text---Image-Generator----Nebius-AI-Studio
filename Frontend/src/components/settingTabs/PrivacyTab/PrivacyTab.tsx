import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Download, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

export const PrivacyTab: React.FC = () => {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Database className="text-blue-500" size={18} /> Data & Privacy
      </h2>
      <Button variant="outline" className="flex items-center gap-2">
        <Download size={16} /> Download My Data
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className="flex items-center gap-2">
            <Trash2 size={16} /> Clear Prompt History
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear History?</DialogTitle>
            <DialogDescription>
              This will delete all your generated prompts permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Clear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
