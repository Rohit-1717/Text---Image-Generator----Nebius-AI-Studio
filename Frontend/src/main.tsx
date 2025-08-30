import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <App />
        <Toaster richColors position="top-right"/>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
