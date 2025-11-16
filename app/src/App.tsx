import "./App.css";
import { Route, Routes } from "react-router-dom";

import { ForgotPasswordForm } from "./features/auth/components/ForgotPasswordForm";
import { LoginForm } from "./features/auth/components/LoginForm";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { ProjectArtifactsScreen } from "./features/useCases/components/ProjectArtifactsScreen";
import { UseCaseDetailsScreen } from "./features/useCases/components/UseCaseDetailsScreen";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UseCaseDetailsScreen />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/artifacts" element={<ProjectArtifactsScreen />} />
      </Routes>
    </>
  );
}

export default App;
