import { useState, useEffect } from "react";
import GeneratorPage from "../generator_page/GeneratorPage";
import Sidebar from "../sidebar/Sidebar";
import { useApiStore } from "@/store/useApiStore";
import useAuthStore from "@/store/useAuthStore";

export default function Layout() {
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const { fetchSessions, fetchGeneratedImages } = useApiStore();
  const { fetchMe } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await fetchMe();
      await fetchGeneratedImages();
      await fetchSessions();
    };
    init();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        activeSession={activeSession}
        setActiveSession={setActiveSession}
      />
      <GeneratorPage
        activeSession={activeSession}
        setActiveSession={setActiveSession}
      />
    </div>
  );
}
