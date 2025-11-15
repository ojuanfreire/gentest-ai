import { useState, useEffect } from "react";

import type { UseCase } from "../../../types/index.ts";
import type { UseCaseFormData } from "../components/CreateUseCaseModal";

// Mock de Dados
// Simula dados que viriam do Supabase
const MOCK_USE_CASES: UseCase[] = [
  {
    id: "uc-001",
    title: "Efetuar Login de Usuário",
    description: "Permite que um usuário autenticado acesse o sistema.",
    projectId: "proj-123",
    createdAt: "2024-10-25T10:00:00Z",
    actor: "Usuário",
    preconditions:
      "O usuário deve estar na página de login e possuir uma conta válida.",
    mainFlow:
      "1. O usuário informa e-mail.\n2. O usuário informa senha.\n3. O sistema valida as credenciais.\n4. O sistema redireciona para o dashboard.",
    alternativeFlows:
      "4a. Credenciais inválidas: O sistema exibe a mensagem 'E-mail ou senha inválidos'.",
  },
  {
    id: "uc-002",
    title: "Registrar Nova Conta",
    description: "Permite que um visitante crie uma nova conta de usuário.",
    projectId: "proj-123",
    createdAt: "2024-10-24T14:30:00Z",
    actor: "Visitante",
    preconditions: "O visitante deve estar na página de registro.",
    mainFlow:
      "1. O visitante informa nome, e-mail e senha.\n2. O sistema valida os dados.\n3. O sistema cria a conta.",
    alternativeFlows:
      "2a. E-mail já existe: O sistema exibe a mensagem 'E-mail já cadastrado'.",
  },
];
// --- Fim do Mock ---

export const useUseCases = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para buscar os casos de uso (atualmente mockada)
  const fetchUseCases = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Código original (chamada real ao serviço)
      // const data = await useCaseService.getUseCasesByProjectId(projectId);

      // Mock da chamada ao serviço
      console.log(`Mock: Buscando casos de uso para o projeto: ${projectId}`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula rede

      setUseCases(MOCK_USE_CASES);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar casos de uso.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUseCase = async (data: UseCaseFormData) => {
    console.log("Tentando criar um novo caso de uso com:", data);
    setIsSubmitting(true);

    try {
      // Simula a chamada à API para criar caso de uso
      // Código original (chamada real ao serviço)
      // await useCaseService.createUseCase(data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 segundo

      // Simula o retorno da API com o novo caso de uso
      const newUseCase: UseCase = {
        id: `uc-${Math.random().toString(36).substring(2, 9)}`,
        projectId: "proj-123",
        createdAt: new Date().toISOString(),

        title: data.title,
        description: data.description,
        actor: data.actor,
        preconditions: data.preconditions,
        mainFlow: data.mainFlow,
        alternativeFlows: data.alternativeFlows,
      };

      setUseCases((listaAtual) => [newUseCase, ...listaAtual]);

      console.log("Novo caso de uso adicionado ao estado local!");
      return true;
    } catch (err: any) {
      console.error("Erro ao criar caso de uso:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUseCases("proj-123");
  }, []);

  // Usado para atualizar o título da página
  useEffect(() => {
    console.log("EFEITO 2 (Título) disparado!");

    if (loading) {
      document.title = "Carregando Casos de Uso...";
    } else if (error) {
      document.title = "Erro ao carregar";
    } else {
      document.title = `Projeto (${useCases.length} Casos de Uso)`;
    }

    return () => {
      document.title = "GenTest AI"; // Limpa o título ao sair da tela
    };
  }, [loading, error, useCases]);

  return { loading, error, useCases, isSubmitting, handleCreateUseCase };
};
