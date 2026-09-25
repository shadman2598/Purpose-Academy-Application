import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AuthProvider } from "./state/auth";
import { ContentProvider } from "./state/content";
import { ProgressProvider } from "./state/progress";
import { ProgressSync } from "./state/sync";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProgressProvider>
      <AuthProvider>
        <ContentProvider>
          <ProgressSync />
          <App />
        </ContentProvider>
      </AuthProvider>
    </ProgressProvider>
  </StrictMode>,
);
