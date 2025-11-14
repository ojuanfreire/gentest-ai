import { useState } from "react"; //
// Importa o serviço, descomentar quando for implementado
// import * as authService from '../services/authService'; //

export const useAuth = () => {
  const [loading, setLoading] = useState(false); //
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
    } catch (err: any) {
      // Captura o erro do serviço para exibir na UI
      setError(err.message); //
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
      // Código original (chamada real ao serviço)
      // const user = await authService.signUp(name, email, password);

      // Mock da chamada de registro
      console.log(`Mock: Tentando registro para ${name} com: ${email}`);

      // Simula um atraso de rede
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simula erro
      if (email.includes("error@")) {
        throw new Error("Este e-mail já está em uso.");
      }

      // Simula um retorno de usuário bem-sucedido
      const user = {
        id: "mock-user-456",
        name: name,
        email: email,
      };
      // Fim do Mock

      console.log("Mock: Registro bem-sucedido!");
      return user;
    } catch (err: any) {
      // Captura o erro do serviço para exibir na UI
      console.error("Mock: Erro no registro:", err.message);
      setError(err.message);
    } finally {
      // Garante que o loading pare, mesmo se der erro
      setLoading(false);
    }
  };

  return { loading, error, handleSignIn, handleSignUp };
};
