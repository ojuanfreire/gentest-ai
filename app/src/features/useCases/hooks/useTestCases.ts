import { useState, useEffect, useCallback } from "react";
import { useCaseService } from "../services/useCaseService"; 
import type { TestCase } from "../../../types";

export const useTestCases = (useCaseId: string | number) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

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

  useEffect(() => {
    fetchTestCases();
  }, [fetchTestCases]);

  return { loading, error, testCases };
};