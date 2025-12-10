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
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao buscar casos de teste.");
      }
    } finally {
      setLoading(false);
    }
  }, [useCaseId]);

  const handleEditTestCase = async (updatedTest: TestCase) => {
    setIsSubmitting(true);
    try {
      const savedTest = await useCaseService.updateTestCase(updatedTest);

      setTestCases((prev) =>
        prev.map((t) => (t.id === savedTest.id ? savedTest : t))
      );
      return true;
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || "Erro ao editar caso de teste.");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestCase = async (testCaseId: string) => {
    setIsSubmitting(true);
    try {
      await useCaseService.deleteTestCaseById(testCaseId);

      setTestCases((prev) => prev.filter((t) => t.id !== testCaseId));
      return true;
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || "Erro ao excluir caso de teste.");
      }
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
    fetchTestCases,
  };
};
