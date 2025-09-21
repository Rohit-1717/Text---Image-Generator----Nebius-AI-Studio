import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
  plan?: string;
  emailVerified?: boolean;
  googleId?: string;
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

  sendVerificationEmail: () => Promise<void>;
  verifyEmailToken?: (token: string) => Promise<void>;

  updateUser: (data: {
    name?: string;
    password?: string;
    avatar?: string | File;
  }) => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
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

  sendVerificationEmail: async () => {
    try {
      await axios.post(`${API_URL}/api/auth/email/send-verification`);
      toast.success("Verification email sent! Check your inbox.");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to send verification email"
      );
    }
  },

  verifyEmailToken: async (token: string) => {
    try {
      await axios.get(`${API_URL}/api/auth/email/verify/${token}`);
      toast.success("Email verified successfully!");
      await get().fetchMe(); // refresh user data after verification
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Email verification failed");
    }
  },

  updateUser: async (data) => {
    try {
      set({ loading: true, error: null });

      let payload: any = data;
      let headers = {};

      // Narrow avatar type for TypeScript
      if (data.avatar && data.avatar instanceof File) {
        payload = new FormData();
        if (data.name) payload.append("name", data.name);
        if (data.password) payload.append("password", data.password);
        payload.append("avatar", data.avatar);

        headers = { "Content-Type": "multipart/form-data" };
      }

      const res = await axios.put(`${API_URL}/api/user/update-user`, payload, {
        withCredentials: true,
        headers,
      });

      set({ user: { ...get().user, ...res.data.data }, loading: false });
      toast.success(res.data.message || "Profile updated successfully!");
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Update failed",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Update failed");
    }
  },
}));

export default useAuthStore;
