import { useState, useEffect, useMemo } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { useApiStore } from "@/store/useApiStore";

interface SidebarProps {
  activeSession: string | null;
  setActiveSession: (sessionId: string | null) => void;
}

export default function Sidebar({
  activeSession,
  setActiveSession,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, logout } = useAuthStore();
  const {
    sessions,
    fetchSessions,
    createSession,
    loadSession,
    setActiveSession: setActiveSessionInStore,
    deleteSession,
    renameSession,
    images,
  } = useApiStore();

  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    navigate("/");
  };

  const handleNewSession = async () => {
    const session = await createSession();
    if (session) {
      await loadSession(session._id);
      setActiveSession(session._id);
      setActiveSessionInStore(session._id);
    }
  };

  const handleSessionClick = async (sessionId: string) => {
    await loadSession(sessionId);
    setActiveSession(sessionId);
    setActiveSessionInStore(sessionId);
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
    if (activeSession === sessionId) {
      setActiveSession(null);
      setActiveSessionInStore(null);
    }
  };

  const handleRenameSession = async (sessionId: string, newName: string) => {
    await renameSession(sessionId, newName);
  };

  useEffect(() => {
    if (window.innerWidth < 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Auto-select default session if none active
  useEffect(() => {
    if (!activeSession && sessions.length > 0) {
      const latestSession = sessions[0];
      setActiveSession(latestSession._id);
      setActiveSessionInStore(latestSession._id);
      loadSession(latestSession._id);
    }
  }, [sessions, activeSession, setActiveSessionInStore, loadSession]);

  // Map to keep track of last known image per session
  const lastImagesMap = useMemo(() => {
    const map: Record<string, (typeof images)[0]> = {};
    images.forEach((img) => {
      const sessionId = img.session;
      if (
        !map[sessionId] ||
        new Date(img.createdAt) > new Date(map[sessionId].createdAt)
      ) {
        map[sessionId] = img;
      }
    });
    return map;
  }, [images]);

  // Compute sessions with last image & label (prompt)
  const sessionsWithThumbnails = useMemo(() => {
    return sessions.map((session) => {
      const lastImage = lastImagesMap[session._id];
      return {
        ...session,
        lastImage,
        label: lastImage?.prompt || session.title || "Untitled Session",
      };
    });
  }, [sessions, lastImagesMap]);

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-zinc-950 text-white h-screen flex flex-col transition-all duration-300 border-r border-zinc-800`}
    >
      {/* Header */}
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

      {/* New Generation */}
      <div className="p-3">
        <Button
          className="w-full justify-start"
          variant="secondary"
          onClick={handleNewSession}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isOpen && "New Generation"}
        </Button>
      </div>

      <Separator />

      {/* Sessions */}
      <nav className="flex-1 overflow-y-auto px-2 mt-1 space-y-1 text-sm [scrollbar-width:thin] [scrollbar-color:#3f3f46_#18181b] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        {sessionsWithThumbnails.length > 0 ? (
          sessionsWithThumbnails.map((session) => (
            <SidebarItem
              key={session._id}
              icon={<ImageIcon size={18} />}
              label={session.label}
              isOpen={isOpen}
              showPreview={true} // Always show preview
              previewUrl={session.lastImage?.imageUrl}
              isActive={activeSession === session._id}
              onClick={() => handleSessionClick(session._id)}
              onDelete={async () => handleDeleteSession(session._id)}
              onRename={async (newName) =>
                handleRenameSession(session._id, newName)
              }
            />
          ))
        ) : (
          <SidebarItem
            key="placeholder"
            icon={<ImageIcon size={18} />}
            label="Generate your first image..."
            isOpen={isOpen}
            showPreview={true}
            previewUrl="/placeholder.webp"
            isActive={false}
            onClick={handleNewSession}
          />
        )}
      </nav>

      <Separator />

      {/* Footer */}
      {user && (
        <div className="p-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full flex items-center rounded-md transition ${
                  isOpen ? "justify-start gap-3" : "justify-center"
                }`}
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
                <Button asChild variant="ghost" className="justify-start gap-2">
                  <Link to="/profile">
                    <User size={16} /> Profile
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="justify-start gap-2">
                  <Link to="/settings">
                    <Settings size={16} /> Settings
                  </Link>
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
                      <Loader2 className="h-4 w-4 animate-spin" /> Logging
                      out...
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
