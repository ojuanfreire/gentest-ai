import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { supabase } from "../../../api/supabaseClient";
import { aiGenerationService } from "../services/aiGenerationService";
import type { UseCase, TestCase } from "../../../types";

// Mock do Supabase
vi.mock("../../../api/supabaseClient", () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Dados Mockados - Caso de Uso
const mockFrontendUseCase: UseCase = {
  id: "uc-123",
  name: "Teste de Login",
  actor: "Usuário",
  preconditions: "Estar na tela de login",
  mainFlow: "Fazer X, Y, Z",
  alternativeFlows: "Nenhum",
  projectId: "proj-123",
  createdAt: "2025-01-01T00:00:00Z",
  description: "Um caso de uso de teste",
};

// Dados Mockados - Caso de Teste (Para o Code Skeleton)
const mockTestCase: TestCase = {
  id: "tc-999",
  useCaseId: "uc-123",
  title: "Login com Sucesso",
  description: "Verifica se o usuário consegue logar com credenciais válidas",
  type: "Caminho Feliz",
  precondition: "Usuário na página de login",
  steps: "1. Inserir email\n2. Inserir senha\n3. Clicar em entrar",
  expectedResult: "Redirecionar para dashboard",
};

const mockGeneratedTests = [
  {
    title: "Login com Sucesso",
    description: "Teste de sucesso",
    type: "Caminho Feliz",
    precondition: "Estar na tela de login",
    steps: "Fazer X, Y, Z",
    expected_result: "Login com sucesso",
  },
];

describe("aiGenerationService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("generateTestCases", () => {
    it("deve transformar o payload corretamente e chamar a Edge Function", async () => {
      // Configura sucesso
      (supabase.functions.invoke as Mock).mockResolvedValue({
        data: mockGeneratedTests,
        error: null,
      });

      const result = await aiGenerationService.generateTestCases(mockFrontendUseCase);

      // Verifica a transformação de dados e chamada
      expect(supabase.functions.invoke).toHaveBeenCalledWith("generate-test-cases", {
        body: {
          useCase: {
            name: "Teste de Login",
            actor: "Usuário",
            preConditions: "Estar na tela de login",
            mainFlow: "Fazer X, Y, Z",
            alternativeFlows: "Nenhum",
          },
        },
      });

      expect(result).toEqual(mockGeneratedTests);
    });

    it("deve lançar um erro legível se a Edge Function falhar", async () => {
      const mockError = { message: "Timeout na geração" };

      (supabase.functions.invoke as Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        aiGenerationService.generateTestCases(mockFrontendUseCase)
      ).rejects.toThrow("Erro na IA (Test Cases): Timeout na geração");
    });
  });

  describe("generateCodeSkeleton", () => {
    it("deve chamar a Edge Function com os parâmetros corretos e retornar o código", async () => {
      const mockGeneratedCode = "console.log('Hello World');";
      const framework = "JavaScript + Cypress";

      // Configura sucesso
      (supabase.functions.invoke as Mock).mockResolvedValue({
        data: { code: mockGeneratedCode },
        error: null,
      });

      const result = await aiGenerationService.generateCodeSkeleton(mockTestCase, framework);

      expect(supabase.functions.invoke).toHaveBeenCalledWith("generate-code-skeleton", {
        body: {
          testCase: mockTestCase,
          framework: framework,
        },
      });

      expect(result).toBe(mockGeneratedCode);
    });

    it("deve lançar erro se a Edge Function retornar erro", async () => {
      const mockError = { message: "Erro interno do servidor" };

      (supabase.functions.invoke as Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(
        aiGenerationService.generateCodeSkeleton(mockTestCase, "Python + Playwright")
      ).rejects.toThrow("Erro na IA (Code Skeleton): Erro interno do servidor");
    });

    it("deve lançar erro se a IA não retornar a propriedade 'code'", async () => {
      // Simula resposta 200 OK, mas sem o campo 'code' esperado
      (supabase.functions.invoke as Mock).mockResolvedValue({
        data: { message: "Gerei algo, mas não foi código" }, 
        error: null,
      });

      await expect(
        aiGenerationService.generateCodeSkeleton(mockTestCase, "JavaScript + Cypress")
      ).rejects.toThrow("A IA não retornou um código válido.");
    });
  });
});