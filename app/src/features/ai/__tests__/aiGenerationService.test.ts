import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { supabase } from "../../../api/supabaseClient";
import { aiGenerationService } from "../services/aiGenerationService";
import type { UseCase } from "../../../types";

vi.mock("../../../api/supabaseClient", () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mockando um caso de uso no formato esperado pelo frontend
const mockFrontendUseCase: UseCase = {
  id: "uc-123",
  title: "Teste de Login",
  actor: "Usuário",
  preconditions: "Estar na tela de login",
  mainFlow: "Fazer X, Y, Z",
  alternativeFlows: "Nenhum",
  projectId: "proj-123",
  createdAt: "2025-01-01T00:00:00Z",
  description: "Um caso de uso de teste",
};


// Mockando a resposta gerada pela Edge Function
const mockGeneratedTests = [
  {
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

  it("deve chamar a Edge Function com os dados traduzidos e retornar os casos de teste", async () => {
    
    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: mockGeneratedTests,
      error: null,
    });

    const result = await aiGenerationService.generateTestCases(mockFrontendUseCase);

    expect(supabase.functions.invoke).toHaveBeenCalledWith(
      "generate-test-cases",
      {
        body: {
          useCase: {
            name: "Teste de Login",
            actor: "Usuário",
            preConditions: "Estar na tela de login",
            mainFlow: "Fazer X, Y, Z",
            alternativeFlows: "Nenhum",
          },
        },
      }
    );

    expect(result).toEqual(mockGeneratedTests);
  });

  it("deve lançar um erro se a Edge Function falhar", async () => {
    const mockError = { message: "Função falhou" };

    (supabase.functions.invoke as Mock).mockResolvedValue({
      data: null,
      error: mockError,
    });

    await expect(
      aiGenerationService.generateTestCases(mockFrontendUseCase)
    ).rejects.toThrow(mockError.message);
  });
});