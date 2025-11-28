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
    project_id: "proj-123",
    created_at: "2025-01-01T00:00:00Z",
    actor: "Usuário",
    preconditions: "Nenhuma",
    main_flow: "Passo 1",
    alternative_flows: "Passo 2"
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
  it("deve buscar os casos de uso do banco e transformar para camelCase", async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: MOCK_USE_CASES, error: null });
    (supabase.from as Mock).mockReturnValue({ select: mockSelect });

    const result = await useCaseService.getUseCases();

    expect(supabase.from).toHaveBeenCalledWith("use_cases");
    expect(mockSelect).toHaveBeenCalledWith("*");
    
    expect(result[0]).toEqual({
      id: "uc-001",
      title: "Efetuar Login",
      projectId: "proj-123",
      createdAt: "2025-01-01T00:00:00Z",
      actor: "Usuário",
      preconditions: "Nenhuma",
      mainFlow: "Passo 1",
      alternativeFlows: "Passo 2",
      description: undefined
    });
  });

  // Teste para criar um novo Caso de Uso
  it("deve criar um novo caso de uso", async () => {
    const returnedDbData = { 
      id: "uc-999", 
      title: MOCK_FORM_DATA.title,
      description: MOCK_FORM_DATA.description,
      actor: MOCK_FORM_DATA.actor,
      preconditions: MOCK_FORM_DATA.preconditions,
      main_flow: MOCK_FORM_DATA.mainFlow,
      alternative_flows: MOCK_FORM_DATA.alternativeFlows,
      project_id: "proj-123",
      created_at: "2025-01-01"
    };
    
    const mockSingle = vi.fn().mockResolvedValue({ data: returnedDbData, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
    
    (supabase.from as Mock).mockReturnValue({ insert: mockInsert });

    const result = await useCaseService.createUseCase(MOCK_FORM_DATA);

    expect(supabase.from).toHaveBeenCalledWith("use_cases");
    // Verifica se o payload enviado para o banco foi convertido para snake_case corretamente
    expect(mockInsert).toHaveBeenCalledWith({
      title: "Novo UC",
      description: "Desc",
      actor: "Ator",
      preconditions: "Pre",
      main_flow: "Main",
      alternative_flows: "Alt"
    });
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockSingle).toHaveBeenCalled();
    
    // Verifica se o resultado final voltou para camelCase
    expect(result.id).toBe("uc-999");
    expect(result.mainFlow).toBe("Main");
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

  // Busca Casos de Teste (com transformação de dados)
  it("deve buscar e transformar casos de teste", async () => {
    const mockDbTestCases = [
      {
        id: 1,
        created_at: "2025-01-01",
        type: "Happy Path",
        expected_result: "Success",
        use_case_id: "uc-001",
        steps: "Steps",
        precondition: "Pre"
      },
    ];

    const mockEq = vi.fn().mockResolvedValue({ data: mockDbTestCases, error: null });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as Mock).mockReturnValue({ select: mockSelect });

    const result = await useCaseService.getTestCases("uc-001");
    expect(result).toBeDefined();
  });

  it("deve salvar os casos de teste gerados vinculando ao ID correto", async () => {
    const useCaseId = "uc-001";
    const mockGeneratedTests = [
      { 
        type: "Happy Path", 
        precondition: "Estar logado", 
        steps: "1. Clicar em sair", 
        expected_result: "Logout efetuado" 
      }
    ];

    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as Mock).mockReturnValue({ insert: mockInsert });

    const result = await useCaseService.createTestCases(mockGeneratedTests, useCaseId);

    expect(mockInsert).toHaveBeenCalledWith([
      { ...mockGeneratedTests[0], use_case_id: useCaseId }
    ]);
    expect(result).toBe(true);
  });

  // Tratamento de Erro
  it("deve lançar erro quando o supabase falhar", async () => {
    const mockSelect = vi.fn().mockResolvedValue({ 
      data: null, 
      error: { message: "Erro de conexão" } 
    });
    (supabase.from as Mock).mockReturnValue({ select: mockSelect });

    await expect(useCaseService.getUseCases()).rejects.toThrow("Erro de conexão");
  });
});