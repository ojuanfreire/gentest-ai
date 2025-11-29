import "./App.css";
import { Route, Routes } from "react-router-dom";

import { ForgotPasswordForm } from "./features/auth/components/ForgotPasswordForm";
import { LoginForm } from "./features/auth/components/LoginForm";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { ProjectArtifactsScreen } from "./features/useCases/components/ProjectArtifactsScreen";
import { UseCaseDetailsScreen } from "./features/useCases/components/UseCaseDetailsScreen";
import { TestCaseDetailsScreen } from "./features/testCases/components/TestCaseDetailsScreen";
import { ProjectMenuScreen } from "./features/projects/components/ProjectMenuScreen";
import { CodeSkeletonScreen } from "./features/testCases/components/CodeSkeletonScreen";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/projects" element={<ProjectMenuScreen />} />
        <Route path="/project/:projectId/artifacts" element={<ProjectArtifactsScreen />} />
        <Route path="/use-case/:id" element={<UseCaseDetailsScreen />} />
        <Route path="/test-case/:id" element={<TestCaseDetailsScreen />} />
        <Route path="/skeleton/:id" element={<CodeSkeletonScreen />} />
      </Routes>
    </>
  );
}

export default App;
