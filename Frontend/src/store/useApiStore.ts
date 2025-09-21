import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";
import useAuthStore from "./useAuthStore";

const MODEL_API_URL = import.meta.env.VITE_MODEL_API_URL;

const handleApiError = (err: unknown, functionName: string): string => {
  const error = err as any;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    `Unknown error in ${functionName}`;
  console.error(`[${functionName}]`, error);
  toast.error(`${functionName} failed: ${message}`);
  return message;
};

interface GenerateImageResult {
  imageUrl?: string;
  model?: string;
  text?: string;
  sessionId?: string;
}

interface GeneratedImage {
  _id: string;
  user: string;
  prompt: string;
  model: string;
  imageUrl: string;
  session: string;
  createdAt: string;
  updatedAt: string;
}

interface PendingImage {
  _id: string;
  prompt: string;
  status: "loading" | "done";
}

interface GenerationSession {
  _id: string;
  title?: string;
  createdAt: string;
  lastImage?: GeneratedImage;
}

interface ApiState {
  loading: boolean;
  error: string | null;
  images: GeneratedImage[];
  sessions: GenerationSession[];
  pending: PendingImage[];
  lastImage: GeneratedImage | null;
  activeSession: string | null;

  createSession: () => Promise<GenerationSession | null>;
  generateImage: (
    model: string,
    prompt: string,
    file?: File,
    sessionId?: string
  ) => Promise<GenerateImageResult | null>;
  fetchGeneratedImages: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  fetchSessionById: (sessionId: string) => Promise<any>;
  loadSession: (sessionId: string) => Promise<void>;
  setActiveSession: (sessionId: string | null) => void;
  deleteSession: (id: string) => Promise<void>;
  renameSession: (id: string, newName: string) => Promise<void>;
  initUserSession: (userId: string) => Promise<void>; // ✅ new method
}

export const useApiStore = create<ApiState>((set, get) => ({
  loading: false,
  error: null,
  images: [],
  sessions: [],
  pending: [],
  lastImage: null,
  activeSession: null,

  // ✅ Initialize user session: last session or create one
  initUserSession: async (userId: string) => {
    try {
      await get().fetchSessions();
      const sessions = get().sessions;

      if (sessions.length > 0) {
        // Select the last (newest) session
        set({ activeSession: sessions[0]._id });
      } else {
        // No session exists, create one automatically
        const newSession = await get().createSession();
        if (newSession) set({ activeSession: newSession._id });
      }
    } catch (err) {
      const message = handleApiError(err, "initUserSession");
      set({ error: message });
    }
  },

  generateImage: async (model, prompt, file, sessionId) => {
    const authUser = useAuthStore.getState().user;
    if (!authUser) {
      toast.error("You must be logged in");
      return null;
    }

    // Use provided sessionId or activeSession
    let activeSession = sessionId || get().activeSession;

    // ✅ If no session exists, initialize one automatically
    if (!activeSession) {
      await get().initUserSession(authUser.id);
      activeSession = get().activeSession;
      if (!activeSession) {
        toast.error("Failed to initialize session");
        return null;
      }
    }

    const endpoints: Record<string, string> = {
      "nebius-ai": `${MODEL_API_URL}/api/generate/nebius-image`,
      "gemini-ai": `${MODEL_API_URL}/api/generate/gemini-image`,
      "openai-ai": `${MODEL_API_URL}/api/generate/openai-image`,
      midjourney: `${MODEL_API_URL}/api/generate/midjourney-image`,
      runway: `${MODEL_API_URL}/api/generate/runway-image`,
      "x-ai": `${MODEL_API_URL}/api/generate/x-ai-image`,
      openAI: `${MODEL_API_URL}/api/generate/openai-image`,
    };

    const endpoint = endpoints[model];
    if (!endpoint) {
      toast.error(`No endpoint defined for ${model}`);
      return null;
    }

    const tempId = `pending-${Date.now()}`;
    set((state) => ({
      pending: [...state.pending, { _id: tempId, prompt, status: "loading" }],
    }));

    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("prompt", prompt);
        formData.append("sessionId", activeSession);
        response = await axios.post(endpoint, formData, {
          withCredentials: true,
        });
      } else {
        response = await axios.post(
          endpoint,
          { prompt, sessionId: activeSession },
          { withCredentials: true }
        );
      }

      const resultData = response.data?.data || response.data;

      if (!resultData.imageUrl) {
        toast.error("No image URL returned from API");
        return null;
      }

      const newImage: GeneratedImage = {
        _id: resultData._id || Date.now().toString(),
        prompt: resultData.prompt || prompt,
        user: authUser.id,
        model: resultData.model || model,
        session: activeSession,
        imageUrl: resultData.imageUrl,
        createdAt: resultData.createdAt || new Date().toISOString(),
        updatedAt: resultData.updatedAt || new Date().toISOString(),
      };

      set((state) => {
        const images = [
          newImage,
          ...state.images.filter((i) => i._id !== newImage._id),
        ];
        const pending = state.pending.filter((p) => p._id !== tempId);
        const sessions = state.sessions.map((s) =>
          s._id === activeSession ? { ...s, lastImage: newImage } : s
        );
        return { images, pending, lastImage: newImage, sessions };
      });

      return {
        imageUrl: newImage.imageUrl,
        model: newImage.model,
        text: newImage.prompt,
        sessionId: newImage.session,
      };
    } catch (err) {
      set((state) => ({
        pending: state.pending.filter((p) => p._id !== tempId),
      }));
      const message = handleApiError(err, "generateImage");
      set({ error: message });
      return null;
    }
  },

  fetchGeneratedImages: async () => {
    const authUser = useAuthStore.getState().user;
    if (!authUser) return;

    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${MODEL_API_URL}/api/generate/images-generated`,
        { withCredentials: true }
      );
      set({ images: response.data?.data?.images || [] });
    } catch (err) {
      const message = handleApiError(err, "fetchGeneratedImages");
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  fetchSessions: async () => {
    const authUser = useAuthStore.getState().user;
    if (!authUser) return;

    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${MODEL_API_URL}/api/sessions/get-user-session`,
        { withCredentials: true }
      );
      const sessionsFromApi: GenerationSession[] = response.data?.data || [];

      if (!get().images.length) await get().fetchGeneratedImages();
      const images = get().images;

      const sessionsWithLastImage = sessionsFromApi.map((session) => {
        const sessionImages = images
          .filter((img) => img.session === session._id)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        return { ...session, lastImage: sessionImages[0] };
      });

      set({ sessions: sessionsWithLastImage });
    } catch (err) {
      const message = handleApiError(err, "fetchSessions");
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  fetchSessionById: async (sessionId: string) => {
    try {
      const response = await axios.get(
        `${MODEL_API_URL}/api/sessions/${sessionId}`,
        { withCredentials: true }
      );
      return response.data?.data || null;
    } catch (err) {
      handleApiError(err, "fetchSessionById");
      return null;
    }
  },

  loadSession: async (sessionId: string) => {
    try {
      const session = await get().fetchSessionById(sessionId);
      if (session) {
        set({
          activeSession: session._id,
          images: session.images || [],
        });
      }
    } catch (err) {
      const message = handleApiError(err, "loadSession");
      set({ error: message });
    }
  },

  setActiveSession: (sessionId: string | null) =>
    set({ activeSession: sessionId }),

  createSession: async () => {
    try {
      const response = await axios.post(
        `${MODEL_API_URL}/api/sessions/create`,
        {},
        { withCredentials: true }
      );
      const session = response.data?.data;
      if (session) {
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeSession: session._id,
        }));
        return session;
      }
      return null;
    } catch (err) {
      handleApiError(err, "createSession");
      return null;
    }
  },

  deleteSession: async (id: string) => {
    try {
      await axios.delete(`${MODEL_API_URL}/api/sessions/${id}`, {
        withCredentials: true,
      });
      set((state) => ({
        sessions: state.sessions.filter((s) => s._id !== id),
        images: state.images.filter((img) => img.session !== id),
        activeSession: state.activeSession === id ? null : state.activeSession,
      }));

      // ✅ If user deleted all sessions, create a new one automatically
      if (get().sessions.length === 0) {
        const newSession = await get().createSession();
        if (newSession) set({ activeSession: newSession._id });
      }
    } catch (err) {
      handleApiError(err, "deleteSession");
    }
  },

  renameSession: async (id: string, newName: string) => {
    try {
      const res = await axios.put(
        `${MODEL_API_URL}/api/sessions/${id}`,
        { title: newName },
        { withCredentials: true }
      );
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s._id === id ? { ...s, title: res.data.data.title } : s
        ),
      }));
    } catch (err) {
      handleApiError(err, "renameSession");
    }
  },
}));
