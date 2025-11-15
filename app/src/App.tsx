import "./App.css";

import { ForgotPasswordForm } from "./features/auth/components/ForgotPasswordForm";
import { LoginForm } from "./features/auth/components/LoginForm";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { ProjectArtifactsScreen } from "./features/useCases/components/ProjectArtifactsScreen";

function App() {
  return (
    <>
      <ProjectArtifactsScreen />
    </>
  );
}

export default App;
