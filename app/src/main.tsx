import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { TestCaseDetailsScreen } from "./features/testCases/components/TestCaseDetailsScreen.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TestCaseDetailsScreen />
    </BrowserRouter>
  </StrictMode>
);
