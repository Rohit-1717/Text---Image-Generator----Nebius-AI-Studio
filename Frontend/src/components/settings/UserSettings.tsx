import  { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  CreditCard,
  ShieldCheck,
  HelpCircle,
  Menu,
  ArrowLeft,
} from "lucide-react";

import { ProfileTab } from "../settingTabs/ProfileTab/ProfileTab";
import { BillingTab } from "../settingTabs/BillingTab/BillingTab";
import { SecurityTab } from "../settingTabs/SecurityTab/SecurityTab";
import { SupportTab } from "../settingTabs/SupportTab/SupportTab";
import { useLocation } from "react-router-dom";

function UserSettings() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "profile";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [fullName, setFullName] = useState("User Name");
  const [avatar] = useState("https://i.pravatar.cc/300");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { key: "profile", label: "Profile & Account", icon: <User size={18} /> },
    {
      key: "billing",
      label: "Subscription & Billing",
      icon: <CreditCard size={18} />,
    },
    { key: "security", label: "Security", icon: <ShieldCheck size={18} /> },

    { key: "support", label: "Support", icon: <HelpCircle size={18} /> },
  ];

  const handleTabChange = (tabKey: string) => {
    setLoading(true);
    setActiveTab(tabKey);
    setTimeout(() => setLoading(false), 300);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab
            fullName={fullName}
            setFullName={setFullName}
            avatar={avatar}
          />
        );
      case "billing":
        return <BillingTab />;
      case "security":
        return <SecurityTab />;

      case "support":
        return <SupportTab />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 flex flex-col md:flex-row gap-6">
      {/* Mobile Hamburger */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" className="flex items-center gap-2 mb-4">
            <Menu size={18} /> Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="mb-4 flex items-center gap-2 px-4 py-4">
            <img src="/logo.webp" alt="Company Logo" className="h-8 w-auto" />
          </div>
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "secondary" : "ghost"}
              className="justify-start gap-2 w-full"
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col gap-2 overflow-x-auto md:w-64 border-b md:border-b-0 md:border-r pr-2">
        <div className="mb-4 flex items-center gap-2 px-2">
          <img src="/logo.webp" alt="Company Logo" className="h-10 w-auto" />
        </div>
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "secondary" : "ghost"}
            className="justify-start gap-2 whitespace-nowrap"
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.icon} {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={16} /> Back
        </Button>
        {renderContent()}
      </div>
    </div>
  );
}

export default UserSettings;
