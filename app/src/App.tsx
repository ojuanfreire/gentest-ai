import "./App.css";
import { Route, Routes } from "react-router-dom";

import { ForgotPasswordForm } from "./features/auth/components/ForgotPasswordForm";
import { LoginForm } from "./features/auth/components/LoginForm";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { ProjectArtifactsScreen } from "./features/useCases/components/ProjectArtifactsScreen";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      </Routes>
    </>
  );
}

export default App;
