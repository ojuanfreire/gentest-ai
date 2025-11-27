import { useState, useEffect, useCallback } from "react";
import type { GeneratedSkeleton } from "../../../types";

// --- MOCK DATA ---
const MOCK_SKELETON_DETAIL: GeneratedSkeleton = {
  id: "sk-view-001",
  testCaseId: "tc-101",
  framework: "JavaScript + Cypress",
  code: `describe('Caso de Teste 1: Validar com dados corretos', () => {
  it('deve registrar o usuário com sucesso', () => {
    // 1. Acessar página
    cy.visit('/register');

    // 2. Preencher dados
    cy.get('[data-testid="email-input"]').type('teste@valido.com');
    cy.get('[data-testid="password-input"]').type('123456');

    // 3. Enviar
    cy.get('button[type="submit"]').click();

    // Validação
    cy.url().should('include', '/dashboard');
    cy.contains('Bem-vindo').should('be.visible');
  });
});`,
  createdAt: "2024-10-26T10:00:00Z",
};
// -------------------------------------

export const useCodeSkeleton = (skeletonId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skeleton, setSkeleton] = useState<GeneratedSkeleton | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSkeleton = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Mock: Buscando esqueleto ${skeletonId}`);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSkeleton(MOCK_SKELETON_DETAIL);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar esqueleto.");
    } finally {
      setLoading(false);
    }
  }, [skeletonId]);

  const deleteSkeleton = async () => {
    if (!skeleton) return false;

    setIsSubmitting(true);
    try {
      console.log(`Mock: Deletando esqueleto ${skeleton.id}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchSkeleton();
  }, [fetchSkeleton]);

  return {
    loading,
    error,
    skeleton,
    isSubmitting,
    deleteSkeleton,
  };
};
