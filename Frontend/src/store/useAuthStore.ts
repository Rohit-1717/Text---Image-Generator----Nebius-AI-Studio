import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  user: { id: string; name: string; email: string } | null;
  loading: boolean;
  error: string | null;
  register: (data: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  loginWithGoogle: () => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  register: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${API_URL}/api/auth/register`, data);
      set({ user: res.data.user, loading: false });
      toast.success("User Signup successfully 🎉");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Register failed";
      set({ error: msg, loading: false });
      toast.error(msg); // ❌ toast
    }
  },

  login: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${API_URL}/api/auth/login`, data);
      set({ user: res.data.user, loading: false });
      toast.success("User LoggedIn Successfully 🎉");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },

  fetchMe: async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`);
      set({ user: res.data.user });
    } catch {
      set({ user: null });
    }
  },

  // 🔥 Google OAuth
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/api/auth/google`;
  },

  logout: async () => {
    await axios.post(`${API_URL}/api/auth/logout`);
    set({ user: null });
    toast.info("Logged out");
  },
}));

export default useAuthStore;
