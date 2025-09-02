"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Menu,
  Image as ImageIcon,
  LogOut,
  Settings,
  User,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SidebarItem from "../sidebarItem/SidebarItem";

import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, logout, fetchMe } = useAuthStore();
  const navigate = useNavigate();

  // Fetch current user on mount
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // Collapse by default on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    navigate("/"); // ✅ redirect after logout
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-zinc-950 text-white h-screen flex flex-col transition-all duration-300 border-r border-zinc-800`}
    >
      {/* Header with Morphix logo + toggle */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800 relative">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu />
        </Button>
        {isOpen && (
          <div className="flex items-center gap-2">
            <img
              src="/logo.webp"
              alt="Morphix"
              className="h-6 w-6 object-contain"
            />
            <span className="font-bold">Morphix</span>
          </div>
        )}
      </div>

      {/* New Image Generation */}
      <div className="p-3">
        <Button className="w-full justify-start" variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          {isOpen && "New Generation"}
        </Button>
      </div>

      <Separator />

      {/* History */}
      <nav
        className="flex-1 overflow-y-auto px-2 space-y-1 text-sm
             [scrollbar-width:thin] 
             [scrollbar-color:#3f3f46_#18181b] 
             [&::-webkit-scrollbar]:w-2
             [&::-webkit-scrollbar-track]:bg-zinc-900
             [&::-webkit-scrollbar-thumb]:bg-zinc-700 
             [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <SidebarItem
          icon={<ImageIcon size={18} />}
          label="Futuristic Brain"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<ImageIcon size={18} />}
          label="Abstract Landscapes"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<ImageIcon size={18} />}
          label="Logo Concepts"
          isOpen={isOpen}
        />
      </nav>

      <Separator />

      {/* Footer with Avatar + Account */}
      {user && (
        <div className="p-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full flex items-center rounded-md transition
              ${isOpen ? "justify-start gap-3" : "justify-center"}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${user.name}`
                    }
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isOpen && <span className="truncate">{user.name}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start gap-2">
                  <User size={16} /> Profile
                </Button>
                <Button variant="ghost" className="justify-start gap-2">
                  <Settings size={16} /> Settings
                </Button>
                <Separator />
                <Button
                  variant="ghost"
                  className="justify-start gap-2 text-red-500"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut size={16} /> Logout
                    </>
                  )}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </aside>
  );
}
