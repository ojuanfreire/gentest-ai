import { useState, useEffect, useCallback } from "react";
import type { UseCase } from "../../../types/index.ts";
import type { UseCaseFormData } from "../components/CreateUseCaseModal";

import { useCaseService } from "../services/useCaseService";
import { aiGenerationService } from "../../ai/services/aiGenerationService";

export const useUseCases = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para buscar os casos de uso
  const fetchUseCases = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await useCaseService.getUseCases();
      setUseCases(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao buscar casos de uso.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const getUseCaseById = useCallback(
    async (id: string): Promise<UseCase | undefined> => {
      if (useCases.length > 0) {
        return useCases.find((uc) => uc.id === id);
      }
      return undefined;
    },[useCases]);

  const handleDeleteUseCase = async (useCaseId: string) => {
    setIsSubmitting(true);
    try {
      await useCaseService.deleteUseCase(useCaseId);
      
      setUseCases((currentUseCases) =>
        currentUseCases.filter((uc) => uc.id !== useCaseId)
      );
      return true;
    } catch (err) {
      console.error("Erro ao excluir caso de uso:", err);
      if (err instanceof Error) {
        setError(err.message);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUseCase = async (data: UseCaseFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const newUseCase = await useCaseService.createUseCase(data);

      // Enviando caso de uso criado para o serviço de IA
      const generatedTests = await aiGenerationService.generateTestCases(
        newUseCase
      );

      // Salvando os Casos de Teste criados no banco
      await useCaseService.createTestCases(generatedTests, newUseCase.id);

      setUseCases((listaAtual) => [newUseCase, ...listaAtual]);

      return true;
    } catch (err) {
      console.error("Erro no fluxo de criação:", err);
      if (err instanceof Error) {
        setError(err.message);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------- AINDA NÃO IMPLEMENTADO ------------------------
  const handleEditUseCase = async (updatedUseCase: UseCase) => {
    console.log("Tentando editar o caso de uso:", updatedUseCase);
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUseCases((currentUseCases) =>
        currentUseCases.map((uc) =>
          uc.id === updatedUseCase.id ? updatedUseCase : uc
        )
      );

      console.log("Caso de uso atualizado no estado local!");
      return true;
    } catch (err: any) {
      console.error("Erro ao editar caso de uso:", err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchUseCases("proj-123");
  }, [fetchUseCases]);

  return {
    loading,
    error,
    useCases,
    isSubmitting,
    getUseCaseById,
    handleCreateUseCase,
    handleEditUseCase,
    handleDeleteUseCase,
  };
};
