import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";

export const BillingTab: React.FC = () => {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <CreditCard className="text-purple-500" size={18} /> Subscription &
        Billing
      </h2>
      <p>
        Current Plan: <Badge variant="secondary">Pro</Badge>
      </p>
      <Button variant="secondary">Manage Subscription</Button>
      <Separator />
      <h3 className="text-sm font-medium">Billing History</h3>
      <p className="text-muted-foreground text-sm">No invoices yet.</p>
    </Card>
  );
};
