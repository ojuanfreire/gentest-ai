import { useState, useEffect, useCallback } from "react";
import { useCaseService } from "../../useCases/services/useCaseService";
import type { TestCase, CodeSkeleton, SkeletonFramework } from "../../../types";

export const useTestCaseDetails = (testCaseId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  
  const [skeletons, setSkeletons] = useState<CodeSkeleton[]>([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestCaseDetails = useCallback(async () => {
    if (!testCaseId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await useCaseService.getTestCaseById(testCaseId);
      setTestCase(data);
      
      // TODO: Depois, buscar os esqueletos reais aqui
      setSkeletons([]); 

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao carregar detalhes do caso de teste.");
      }
    } finally {
      setLoading(false);
    }
  }, [testCaseId]);

  useEffect(() => {
    fetchTestCaseDetails();
  }, [fetchTestCaseDetails]);

  const handleEditTestCase = async (updatedData: TestCase) => {
    setIsSubmitting(true);
    try {
      const saved = await useCaseService.updateTestCase(updatedData);
      setTestCase(saved);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        alert("Erro ao atualizar: " + err.message);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestCase = async () => {
    if (!testCaseId) return false;
    setIsSubmitting(true);
    try {
      await useCaseService.deleteTestCaseById(testCaseId);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        alert("Erro ao deletar: " + err.message);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSkeleton = async (framework: SkeletonFramework) => {
    console.log("Gerar esqueleto:", framework);
    alert("A geração de código será implementada posteriormente.");
  };

  const handleDeleteSkeleton = async (skeletonId: string) => {
    console.log("Deletar esqueleto:", skeletonId);
  };

  return {
    loading,
    error,
    testCase,
    skeletons,
    isSubmitting,
    generateSkeleton,
    handleDeleteTestCase,
    handleEditTestCase,
    handleDeleteSkeleton,
  };
};
