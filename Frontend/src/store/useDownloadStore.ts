import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const VITE_API_URL = import.meta.env.VITE_API_URL;

interface DownloadState {
  downloading: Record<string, boolean>; 
  error: string | null;
  downloadImage: (
    url: string,
    format: string,
    imageId: string
  ) => Promise<Blob | null>;
}

export const useDownloadStore = create<DownloadState>((set) => ({
  downloading: {},   
  error: null,

  downloadImage: async (url, format, imageId) => {
    if (!url || !format) {
      toast.error("Invalid download request");
      return null;
    }

    try {
      // ✅ mark only this image as downloading
      set((state) => ({
        downloading: { ...state.downloading, [imageId]: true },
        error: null,
      }));

      const response = await axios.get(
        `${VITE_API_URL}/api/generated-image/download?url=${encodeURIComponent(
          url
        )}&format=${format}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      return new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });
    } catch (err: unknown) {
      const error = err as any;
      const message =
        error.response?.data?.message || error.message || "Download failed";
      set((state) => ({
        error: message,
        downloading: { ...state.downloading, [imageId]: false },
      }));
      toast.error(message);
      return null;
    } finally {
      // ✅ reset only this image
      set((state) => ({
        downloading: { ...state.downloading, [imageId]: false },
      }));
    }
  },
}));
