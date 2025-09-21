import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;
const MODEL_API_URL = import.meta.env.VITE_MODEL_API_URL;


interface Session {
  sessionId: string;
  userId: string;
  userAgent?: string;
  device?: string;
  browser?: string;
  os?: string;
  ip?: string;
  location?: string;
  createdAt: string;
  expiresAt: string;
}

interface SessionState {
  sessions: Session[];
  loading: boolean;
  fetchSessions: () => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  logoutAll: () => Promise<void>;
}

const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  loading: false,

  fetchSessions: async () => {
    set({ loading: true });
    try {
      const res = await axios.get<{ sessions: Session[] }>(
        `${MODEL_API_URL}/api/devices/sessions/`
      );
      set({ sessions: res.data.sessions || [], loading: false });
    } catch (err: any) {
      console.error("Fetch sessions error:", err);
      set({ loading: false });
      toast.error(err.response?.data?.message || "Failed to fetch sessions");
    }
  },

  deleteSession: async (sessionId) => {
    try {
      await axios.delete(`${MODEL_API_URL}/api/devices/sessions/${sessionId}`);
      set({
        sessions: get().sessions.filter((s) => s.sessionId !== sessionId),
      });
      toast.success("Logged out from device");
    } catch (err: any) {
      console.error("Delete session error:", err);
      toast.error(err.response?.data?.message || "Failed to logout session");
    }
  },

  logoutAll: async () => {
    try {
      await axios.post(`${MODEL_API_URL}/api/devices/sessions/logout-all`);
      set({ sessions: [] });
      toast.success("Logged out from all devices");
    } catch (err: any) {
      console.error("Logout all error:", err);
      toast.error(
        err.response?.data?.message || "Failed to logout all devices"
      );
    }
  },
}));

export default useSessionStore;
