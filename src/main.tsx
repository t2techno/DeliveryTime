import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DbProvider from "./providers/db/DbProvider.tsx";
import SettingsProvider from "./providers/settings/SettingsProvider.tsx";
import App from "./App.tsx";
import "./reset.css";
import "./colors.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsProvider>
      <DbProvider>
        <App />
      </DbProvider>
    </SettingsProvider>
  </StrictMode>,
);
