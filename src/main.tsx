import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { TempoDevtools } from "tempo-devtools";
import { AuthProvider } from "@/components/auth";
import { PostHogProvider} from 'posthog-js/react'

TempoDevtools.init();

const basename = import.meta.env.BASE_URL;
const posthogOptions = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  loaded: (posthog) => {
    if (import.meta.env.DEV) {
      posthog.debug(); // Modo debug solo en desarrollo
    }
    posthog.__loaded();
  },
  autocapture: false // Desactiva autocapture si no la necesitas
}
// Force dark mode
document.documentElement.classList.add("dark");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider 
      apiKey={import.meta.env.VITE_POSTHOG_KEY}
      options={posthogOptions}
    >
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    </PostHogProvider>
  </React.StrictMode>,
);
