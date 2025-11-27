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
    project_id: "proj-123", // Simulando retorno do banco (snake_case)
    created_at: "2025-01-01T00:00:00Z",
    // ... outros campos
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

  // Novo Teste: Buscar por ID
  it("deve buscar um caso de uso por ID", async () => {
    const mockSingle = vi.fn().mockResolvedValue({ data: MOCK_USE_CASES[0], error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as Mock).mockReturnValue({ select: mockSelect });

    const result = await useCaseService.getUseCaseById("uc-001");

    expect(supabase.from).toHaveBeenCalledWith("use_cases");
    expect(mockEq).toHaveBeenCalledWith("id", "uc-001");
    expect(result.id).toBe("uc-001");
  });

  // Novo Teste: Deletar
  it("deve deletar um caso de uso", async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as Mock).mockReturnValue({ delete: mockDelete });

    const result = await useCaseService.deleteUseCase("uc-001");

    expect(supabase.from).toHaveBeenCalledWith("use_cases");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", "uc-001");
    expect(result).toBe(true);
  });

  // Novo Teste: Buscar Casos de Teste (com transformação de dados)
  it("deve buscar e transformar casos de teste", async () => {
    const mockDbTestCases = [
      {
        id: 1,
        created_at: "2025-01-01",
        type: "Happy Path",
        expected_result: "Success", // snake_case do banco
        use_case_id: "uc-001",
      },
    ];

    const mockEq = vi.fn().mockResolvedValue({ data: mockDbTestCases, error: null });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as Mock).mockReturnValue({ select: mockSelect });

    const result = await useCaseService.getTestCases("uc-001");

    expect(result[0].expectedResult).toBe("Success"); // Verifica se transformou para camelCase
    expect(result[0].useCaseId).toBe("uc-001");
  });

  it("deve salvar os casos de teste gerados vinculando ao ID correto", async () => {
    const useCaseId = "uc-001";
    const mockGeneratedTests = [
      { 
        type: "Happy Path", 
        precondition: "Estar logado", 
        steps: "1. Clicar em sair", 
        expected_result: "Logout efetuado" 
      },
      { 
        type: "Error", 
        precondition: "Sem internet", 
        steps: "1. Clicar em sair", 
        expected_result: "Erro exibido" 
      }
    ];

    // Mock do insert (que não retorna dados, apenas erro ou null)
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as Mock).mockReturnValue({ insert: mockInsert });

    const result = await useCaseService.createTestCases(mockGeneratedTests, useCaseId);

    expect(supabase.from).toHaveBeenCalledWith("test_cases");
    
    // Verifica se o payload enviado ao banco contém o use_case_id injetado
    const expectedPayload = [
      { ...mockGeneratedTests[0], use_case_id: useCaseId },
      { ...mockGeneratedTests[1], use_case_id: useCaseId }
    ];

    expect(mockInsert).toHaveBeenCalledWith(expectedPayload);
    expect(result).toBe(true);
  });

  // Novo Teste: Tratamento de Erro
  it("deve lançar erro quando o supabase falhar", async () => {
    const mockSelect = vi.fn().mockResolvedValue({ 
      data: null, 
      error: { message: "Erro de conexão" } 
    });
    (supabase.from as Mock).mockReturnValue({ select: mockSelect });

    await expect(useCaseService.getUseCases()).rejects.toThrow("Erro de conexão");
  });
});