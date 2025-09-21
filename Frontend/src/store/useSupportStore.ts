// src/store/useSupportStore.ts
import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const MODEL_API_URL = import.meta.env.VITE_MODEL_API_URL;

interface SupportState {
  loading: boolean;
  error: string | null;
  success: boolean;

  submitReport: (description: string) => Promise<void>;
}

const useSupportStore = create<SupportState>((set) => ({
  loading: false,
  error: null,
  success: false,

  submitReport: async (description: string) => {
    if (!description.trim()) {
      toast.error("Please provide a description for the report");
      return;
    }

    set({ loading: true, error: null, success: false });

    try {
      const res = await axios.post(
        `${MODEL_API_URL}/api/support/report`,
        { description },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Support report submitted!");
      set({ loading: false, success: true });
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to submit report";
      set({ loading: false, error: message, success: false });
      toast.error(message);
    }
  },
}));

export default useSupportStore;
