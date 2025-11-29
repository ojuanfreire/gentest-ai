import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCaseService } from "../../useCases/services/useCaseService";
import { codeSkeletonService } from "../services/codeSkeletonService";
import type { TestCase, CodeSkeleton, SkeletonFramework } from "../../../types";

export const useTestCaseDetails = (testCaseId: string | undefined) => {
  const navigate = useNavigate();
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
      const tcData = await useCaseService.getTestCaseById(testCaseId);
      setTestCase(tcData);

      const skData = await codeSkeletonService.getSkeletonsByTestCaseId(testCaseId);
      setSkeletons(skData);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao carregar detalhes.");
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
    if (!testCase) return;
    
    setIsSubmitting(true);
    try {
      const newSkeleton = await codeSkeletonService.generateSkeleton(testCase, framework);
      
      setSkeletons((prev) => [newSkeleton, ...prev]);
      
      navigate(`/skeleton/${newSkeleton.id}`);
      
    } catch (err) {
      if (err instanceof Error) {
        alert("Erro ao gerar código: " + err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkeleton = async (skeletonId: string) => {
    if(!confirm("Deseja excluir este código?")) return;
    
    try {
      await codeSkeletonService.deleteSkeleton(skeletonId);
      setSkeletons((prev) => prev.filter(s => s.id !== skeletonId));
    } catch (err) {
      if (err instanceof Error) {
        alert("Erro ao excluir: " + err.message);
      }
    }
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
