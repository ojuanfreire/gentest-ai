import { useState, useEffect, useCallback } from "react";
import { codeSkeletonService } from "../services/codeSkeletonService";
import type { CodeSkeleton } from "../../../types";

export const useCodeSkeleton = (skeletonId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skeleton, setSkeleton] = useState<CodeSkeleton | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSkeleton = useCallback(async () => {
    if (!skeletonId) return;
    setLoading(true);
    try {
      const data = await codeSkeletonService.getSkeletonById(skeletonId);
      setSkeleton(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao carregar esqueleto.");
      }
    } finally {
      setLoading(false);
    }
  }, [skeletonId]);

  useEffect(() => {
    fetchSkeleton();
  }, [fetchSkeleton]);

  const deleteSkeleton = async () => {
    if (!skeletonId) return false;
    setIsSubmitting(true);
    try {
      await codeSkeletonService.deleteSkeleton(skeletonId);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        alert("Erro ao excluir: " + err.message);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loading,
    error,
    skeleton,
    isSubmitting,
    deleteSkeleton,
  };
};
