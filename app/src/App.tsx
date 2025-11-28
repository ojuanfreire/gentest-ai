import "./App.css";
import { Route, Routes } from "react-router-dom";

import { ForgotPasswordForm } from "./features/auth/components/ForgotPasswordForm";
import { LoginForm } from "./features/auth/components/LoginForm";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { ProjectArtifactsScreen } from "./features/useCases/components/ProjectArtifactsScreen";
import { UseCaseDetailsScreen } from "./features/useCases/components/UseCaseDetailsScreen";
import { ProjectMenuScreen } from "./features/projects/components/ProjectMenuScreen";

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
      </Routes>
    </>
  );
}

export default App;
