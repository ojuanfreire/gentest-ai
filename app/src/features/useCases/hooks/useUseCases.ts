import { useState, useCallback } from "react";
import type { UseCase } from "../../../types/index";
import type { UseCaseFormData } from "../components/CreateUseCaseModal";

import { useCaseService } from "../services/useCaseService";
import { aiGenerationService } from "../../ai/services/aiGenerationService";

export const useUseCases = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUseCases = useCallback(async (projectId: string) => {
    if (!projectId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await useCaseService.getUseCases(projectId);
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
      setLoading(true);
      setError(null);
      try {
        const data = await useCaseService.getUseCaseById(id);
        return data;
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Erro ao buscar caso de uso.");
        }
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    []
  );

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

  const handleCreateUseCase = async (data: UseCaseFormData, projectId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Passando projectId para o serviço
      const newUseCase = await useCaseService.createUseCase(data, projectId);

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

  const handleEditUseCase = async (updatedUseCase: UseCase) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const savedUseCase = await useCaseService.updateUseCase(updatedUseCase);

      setUseCases((currentUseCases) =>
        currentUseCases.map((uc) =>
          uc.id === savedUseCase.id ? savedUseCase : uc
        )
      );

      return true;
    } catch (err) {
      console.error("Erro ao editar caso de uso:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao atualizar caso de uso.");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loading,
    error,
    useCases,
    isSubmitting,
    fetchUseCases,
    getUseCaseById,
    handleCreateUseCase,
    handleEditUseCase,
    handleDeleteUseCase,
  };
};
