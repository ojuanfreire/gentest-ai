import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { supabase } from "../../../api/supabaseClient";
import { useCaseService } from "../services/useCaseService";
import type { UseCaseFormData } from "../components/CreateUseCaseModal";

// Mockando serviço do supabase
vi.mock("../../../api/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const MOCK_USE_CASES = [
  {
    id: "uc-001",
    title: "Efetuar Login",
    actor: "Usuário",
    preconditions: "Estar na tela de login",
    mainFlow: "Fazer X, Y, Z",
    alternativeFlows: "Nenhum",
    projectId: "proj-123",
    createdAt: "2025-01-01T00:00:00Z",
    description: "Um caso de uso de teste",
  },
];

const MOCK_FORM_DATA: UseCaseFormData = {
  title: "Novo UC",
  description: "Desc",
  actor: "Ator",
  preconditions: "Pre",
  mainFlow: "Main",
  alternativeFlows: "Alt",
};

const MOCK_GENERATED_TESTS = [
  {
    type: "Caminho Feliz",
    precondition: "Estar na tela de login",
    steps: "Fazer X, Y, Z",
    expected_result: "Login com sucesso",
  },
];

describe("useCaseService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // Teste para buscar todos os Casos de Uso
  it("deve buscar os casos de uso do banco", async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: MOCK_USE_CASES, error: null });
    (supabase.from as Mock).mockReturnValue({ select: mockSelect });

    const result = await useCaseService.getUseCases();

    expect(supabase.from).toHaveBeenCalledWith("use_cases");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(result).toEqual(MOCK_USE_CASES);
  });

  // Teste para criar um novo Caso de Uso
  it("deve criar um novo caso de uso", async () => {
    const returnedUseCase = { id: "uc-999", ...MOCK_FORM_DATA };
    
    const mockInsertSelect = vi.fn().mockResolvedValue({
      data: [returnedUseCase],
      error: null,
    });
    
    const mockInsert = vi.fn().mockReturnValue({ select: mockInsertSelect });
    (supabase.from as Mock).mockReturnValue({ insert: mockInsert });

    const result = await useCaseService.createUseCase(MOCK_FORM_DATA);

    expect(supabase.from).toHaveBeenCalledWith("use_cases");
    expect(mockInsert).toHaveBeenCalledWith(MOCK_FORM_DATA);
    expect(mockInsertSelect).toHaveBeenCalledWith("*");
    expect(result).toEqual(returnedUseCase);
  });

  // Teste para salvar casos de teste gerados pela IA
  it("deve salvar os casos de teste gerados pela IA", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as Mock).mockReturnValue({ insert: mockInsert });

    const expectedPayload = [
      {
        type: "Caminho Feliz",
        precondition: "Estar na tela de login",
        steps: "Fazer X, Y, Z",
        expected_result: "Login com sucesso",
        use_case_id: "uc-123",
      },
    ];

    await useCaseService.createTestCases(MOCK_GENERATED_TESTS, "uc-123");

    expect(supabase.from).toHaveBeenCalledWith("test_cases");
    expect(mockInsert).toHaveBeenCalledWith(expectedPayload);
  });
});