import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // 👈 optional avatar from Google OAuth
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, data, {
        withCredentials: true,
      });
      set({ user: res.data.user, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Signup failed",
        loading: false,
      });
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, data, {
        withCredentials: true,
      });
      set({ user: res.data.user, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const res = await axios.get<{ user: User }>(`${API_URL}/api/auth/me`, {
        withCredentials: true, // 👈 force include cookie
      });
      set({ user: res.data.user });
    } catch (err) {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  // 🔥 Google OAuth
  loginWithGoogle: async () => {
    window.open(`${API_URL}/api/auth/google`, "_self");
  },

  logout: async () => {
    await axios.post(`${API_URL}/api/auth/logout`);
    set({ user: null });
    toast.info("Logged out");
  },
}));

export default useAuthStore;
