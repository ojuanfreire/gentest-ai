import { useState, useEffect } from "react";

import type { UseCase } from "../../../types/index.ts";

// Mock de Dados
// Simula dados que viriam do Supabase
const MOCK_USE_CASES: UseCase[] = [
  {
    id: "uc-001",
    title: "Caso de Uso 1: Registrar Usuário",
    description: "Permite que um novo usuário crie uma conta no sistema.",
    projectId: "proj-123",
    createdAt: "2023-10-27T10:00:00Z",
  },
  {
    id: "uc-002",
    title: "Caso de Uso 2: Efetuar Login",
    description: "Permite que um usuário existente acesse sua conta.",
    projectId: "proj-123",
    createdAt: "2023-10-27T10:05:00Z",
  },
  {
    id: "uc-003",
    title: "Caso de Uso 3: Criar Novo Projeto",
    description: "Permite que um usuário logado crie um novo projeto.",
    projectId: "proj-123",
    createdAt: "2023-10-27T10:10:00Z",
  },
];
// --- Fim do Mock ---

export const useUseCases = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCases, setUseCases] = useState<UseCase[]>([]);

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

  // Efeito para buscar os dados quando o hook for montado
  useEffect(() => {
    // ID de projeto chumbado, já que ainda não temos a tela de seleção
    fetchUseCases("proj-123");
  }, []);

  return { loading, error, useCases };
};
