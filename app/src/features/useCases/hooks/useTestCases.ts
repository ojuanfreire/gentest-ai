import { useState, useEffect, useCallback } from "react";
import { useCaseService } from "../services/useCaseService";
import type { TestCase } from "../../../types";

export const useTestCases = (useCaseId: string | number) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestCases = useCallback(async () => {
    if (!useCaseId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await useCaseService.getTestCases(String(useCaseId));
      setTestCases(data);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar casos de teste.");
    } finally {
      setLoading(false);
    }
  }, [useCaseId]);

  const handleEditTestCase = async (updatedTest: TestCase) => {
    setIsSubmitting(true);
    try {
      // Simulação da chamada ao serviço
      // await useCaseService.updateTestCase(updatedTest);

      setTestCases((prev) =>
        prev.map((t) => (t.id === updatedTest.id ? updatedTest : t))
      );
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao editar caso de teste.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestCase = async (testCaseId: string) => {
    setIsSubmitting(true);
    try {
      // Simulação da chamada ao serviço
      // await useCaseService.deleteTestCase(testCaseId);

      setTestCases((prev) => prev.filter((t) => t.id !== testCaseId));
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao excluir caso de teste.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, [fetchTestCases]);

  return {
    loading,
    error,
    testCases,
    isSubmitting,
    handleEditTestCase,
    handleDeleteTestCase,
  };
};
