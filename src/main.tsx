import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@styles/main.css";
import AppWrapper from "@providers/app.wrapper";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppWrapper>
        <App />
      </AppWrapper>
    </StrictMode>
  );
}
