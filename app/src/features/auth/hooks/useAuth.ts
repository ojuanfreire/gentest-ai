import { useState } from "react";
import * as authService from "../services/authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Código original (chamada real ao serviço)
      // const user = await authService.signIn(email, password);

      // Mock da chamada ao serviço
      // Remover ou comentar este bloco quando o authService estiver pronto
      console.log("Mock: Tentando login com: " + email + " " + password);

      // Simula um atraso de rede (ex: 1.5 segundos)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simula um retorno de usuário bem-sucedido
      const user = {
        id: "mock-user-123",
        email: email,
        name: "Usuário Mockado",
      };
      // Fim do Mock

      return user;
    } catch (error) {
      // Captura o erro do serviço para exibir na UI
      if (error instanceof Error) {
        setError(error.message); //
      }
    } finally {
      // Garante que o loading pare, mesmo se der erro
      setLoading(false); //
    }
  };

  const handleSignUp = async (
    name: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.signUp(name, email, password);

      return user;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        throw error;
      }
    } finally {
      // Garante que o loading pare, mesmo se der erro
      setLoading(false);
    }
  };

  const handlePasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      // Código original (chamada real ao serviço)
      // await authService.sendPasswordResetEmail(email);

      // Mock da chamada de recuperação
      console.log(`Mock: Enviando link de reset para: ${email}`);

      // Simula um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simula erro
      if (email.includes("error@")) {
        throw new Error("E-mail não encontrado ou erro no servidor.");
      }

      console.log("Mock: Link de reset enviado!");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return false;
      }
    } finally {
      // Garante que o loading pare, mesmo se der erro
      setLoading(false);
    }
  };

  return { loading, error, handleSignIn, handleSignUp, handlePasswordReset };
};
