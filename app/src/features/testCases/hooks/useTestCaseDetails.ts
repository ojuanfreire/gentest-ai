import { useState, useEffect, useCallback } from "react";
import type {
  TestCase,
  GeneratedSkeleton,
  SkeletonFramework,
} from "../../../types";

// DADOS MOCKADOS
const MOCK_TEST_CASE: TestCase = {
  id: "tc-101",
  useCaseId: "uc-mock-view",
  title: "Caso de Teste 1: Validar com dados corretos",
  description:
    "Este teste verifica o fluxo feliz do registro com dados válidos. O usuário deve ser capaz de inserir e-mail e senha e prosseguir.",
  steps: "1. Acessar página\n2. Preencher dados\n3. Enviar",
  expectedResult: "Sucesso no cadastro",
};

const MOCK_SKELETONS: GeneratedSkeleton[] = [
  {
    id: "sk-001",
    testCaseId: "tc-101",
    framework: "JavaScript + Cypress",
    code: "cy.get('...').type('...')",
    createdAt: "2024-10-26T10:00:00Z",
  },
];

export const useTestCaseDetails = (testCaseId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testCase, setTestCase] = useState<TestCase | null>(null);
  const [skeletons, setSkeletons] = useState<GeneratedSkeleton[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Mock: Buscando detalhes do teste ${testCaseId}`);
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Para poder testar está sempre retornando o mock, independente do ID
      setTestCase(MOCK_TEST_CASE);
      setSkeletons(MOCK_SKELETONS);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar detalhes do caso de teste.");
    } finally {
      setLoading(false);
    }
  }, [testCaseId]);

  const generateSkeleton = async (framework: SkeletonFramework) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newSkeleton: GeneratedSkeleton = {
        id: `sk-${Date.now()}`,
        testCaseId: testCase?.id || "",
        framework,
        code: "// Código gerado...",
        createdAt: new Date().toISOString(),
      };
      setSkeletons((prev) => [newSkeleton, ...prev]);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestCase = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkeleton = async (skeletonId: string) => {
    setSkeletons((prev) => prev.filter((sk) => sk.id !== skeletonId));
  };

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    loading,
    error,
    testCase,
    skeletons,
    isSubmitting,
    generateSkeleton,
    handleDeleteTestCase,
    handleDeleteSkeleton,
  };
};
