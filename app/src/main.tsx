import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { CodeSkeletonScreen } from "./features/testCases/components/CodeSkeletonScreen.tsx";
import { ProjectMenuScreen } from "./features/projects/components/ProjectMenuScreen.tsx";
import { ProjectArtifactsScreen } from "./features/useCases/components/ProjectArtifactsScreen.tsx";
import { TestCaseDetailsScreen } from "./features/testCases/components/TestCaseDetailsScreen.tsx";
import { UseCaseDetailsScreen } from "./features/useCases/components/UseCaseDetailsScreen.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ProjectArtifactsScreen />
    </BrowserRouter>
  </StrictMode>
);
