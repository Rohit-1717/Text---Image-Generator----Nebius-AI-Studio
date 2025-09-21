import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import type { ToasterProps } from "sonner";

const toasterOptions: ToasterProps = {
  richColors: true,
  position: "top-right",
};

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <App />
      <Toaster {...toasterOptions} />
    </BrowserRouter>
  </ThemeProvider>
);
