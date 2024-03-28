import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import ThemeProvider from "./providers/ThemeProvider.tsx";
import "./reset.css";
import ContractionProvider from "./providers/ContractionProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ContractionProvider>
        <App />
      </ContractionProvider>
    </ThemeProvider>
  </React.StrictMode>
);