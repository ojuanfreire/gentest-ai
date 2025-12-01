import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { supabase } from "../../../api/supabaseClient";
import { useCaseService } from "../services/useCaseService";
import type { UseCase, TestCase } from "../../../types";

vi.mock("../../../api/supabaseClient", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const MOCK_USE_CASES = [
  {
    id: "uc-001",
    name: "Efetuar Login",
    project_id: "proj-123",
    created_at: "2025-01-01T00:00:00Z",
    actor: "Usuário",
    preconditions: "Nenhuma",
    main_flow: "Passo 1",
    alternative_flows: "Passo 2",
    description: "Descrição teste"
  },
];

const MOCK_FORM_DATA: any = {
  name: "Novo UC",
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

  it("deve buscar os casos de uso de um projeto (com filtro e ordenação)", async () => {
    const projectId = "proj-123";
    const mockOrder = vi.fn().mockResolvedValue({ data: MOCK_USE_CASES, error: null });
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as Mock).mockReturnValue({ select: mockSelect });

    const result = await useCaseService.getUseCases(projectId);

    expect(supabase.from).toHaveBeenCalledWith("use_cases");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("project_id", projectId);
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });
    
    expect(result[0]).toEqual({
      id: "uc-001",
      name: "Efetuar Login",
      projectId: "proj-123",
      createdAt: "2025-01-01T00:00:00Z",
      actor: "Usuário",
      preconditions: "Nenhuma",
      mainFlow: "Passo 1",
      alternativeFlows: "Passo 2",
      description: "Descrição teste"
    });
  });

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

  it("deve criar um novo caso de uso vinculado a um projeto", async () => {
    const projectId = "proj-123";
    const returnedDbData = { 
      id: "uc-999", 
      name: MOCK_FORM_DATA.name,
      description: MOCK_FORM_DATA.description,
      actor: MOCK_FORM_DATA.actor,
      preconditions: MOCK_FORM_DATA.preconditions,
      main_flow: MOCK_FORM_DATA.mainFlow,
      alternative_flows: MOCK_FORM_DATA.alternativeFlows,
      project_id: projectId,
      created_at: "2025-01-01"
    };
    
    const mockSingle = vi.fn().mockResolvedValue({ data: returnedDbData, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
    
    (supabase.from as Mock).mockReturnValue({ insert: mockInsert });

    const result = await useCaseService.createUseCase(MOCK_FORM_DATA, projectId);

    expect(supabase.from).toHaveBeenCalledWith("use_cases");
    expect(mockInsert).toHaveBeenCalledWith({
      project_id: projectId,
      name: "Novo UC",
      description: "Desc",
      actor: "Ator",
      preconditions: "Pre",
      main_flow: "Main",
      alternative_flows: "Alt"
    });
    expect(result.id).toBe("uc-999");
    expect(result.projectId).toBe(projectId);
  });

  it("deve atualizar um caso de uso existente", async () => {
    const useCaseToUpdate: UseCase = {
      id: "uc-001",
      name: "Nome Atualizado",
      description: "Desc Atualizada",
      actor: "Ator Atualizado",
      preconditions: "Pre Atualizada",
      mainFlow: "Main Atualizado",
      alternativeFlows: "Alt Atualizado",
      projectId: "proj-123",
      createdAt: "2025-01-01"
    };

    const returnedDbData = {
      id: "uc-001",
      name: "Nome Atualizado",
      description: "Desc Atualizada",
      actor: "Ator Atualizado",
      preconditions: "Pre Atualizada",
      main_flow: "Main Atualizado",
      alternative_flows: "Alt Atualizado",
      project_id: "proj-123",
      created_at: "2025-01-01"
    };

    // Mock da cadeia: from -> update -> eq -> select -> single
    const mockSingle = vi.fn().mockResolvedValue({ data: returnedDbData, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as Mock).mockReturnValue({ update: mockUpdate });

    const result = await useCaseService.updateUseCase(useCaseToUpdate);

    expect(supabase.from).toHaveBeenCalledWith("use_cases");
    expect(mockUpdate).toHaveBeenCalledWith({
      name: useCaseToUpdate.name,
      description: useCaseToUpdate.description,
      actor: useCaseToUpdate.actor,
      preconditions: useCaseToUpdate.preconditions,
      main_flow: useCaseToUpdate.mainFlow,
      alternative_flows: useCaseToUpdate.alternativeFlows,
    });
    expect(mockEq).toHaveBeenCalledWith("id", useCaseToUpdate.id);
    expect(result.name).toBe("Nome Atualizado");
  });

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

  it("deve buscar casos de teste de um caso de uso", async () => {
    const mockDbTestCases = [
      {
        id: 1,
        created_at: "2025-01-01",
        title: "Teste 1",
        type: "Happy Path",
        expected_result: "Success",
        use_case_id: "uc-001",
        steps: "Steps",
        precondition: "Pre",
        description: "Desc"
      },
    ];

    const mockOrder = vi.fn().mockResolvedValue({ data: mockDbTestCases, error: null });
    const mockEq = vi.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as Mock).mockReturnValue({ select: mockSelect });

    const result = await useCaseService.getTestCases("uc-001");
    
    expect(supabase.from).toHaveBeenCalledWith("test_cases");
    expect(mockEq).toHaveBeenCalledWith("use_case_id", "uc-001");
    expect(result[0].id).toBe("1");
    expect(result[0].title).toBe("Teste 1");
  });

  it("deve buscar um caso de teste por ID", async () => {
    const mockDbTestCase = {
      id: 10,
      created_at: "2025-01-01",
      title: "Teste Específico",
      type: "Exception",
      expected_result: "Error",
      use_case_id: "uc-001",
      steps: "Steps",
      precondition: "Pre",
      description: "Desc"
    };

    const mockSingle = vi.fn().mockResolvedValue({ data: mockDbTestCase, error: null });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as Mock).mockReturnValue({ select: mockSelect });

    const result = await useCaseService.getTestCaseById("10");

    expect(supabase.from).toHaveBeenCalledWith("test_cases");
    expect(mockEq).toHaveBeenCalledWith("id", "10");
    expect(result.title).toBe("Teste Específico");
  });

  it("deve salvar os casos de teste gerados", async () => {
    const useCaseId = "uc-001";
    const mockGeneratedTests = [
      { 
        title: "Teste Gerado",
        type: "Happy Path", 
        precondition: "Estar logado", 
        steps: "1. Clicar em sair", 
        expected_result: "Logout efetuado",
        description: "Desc"
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

  it("deve atualizar um caso de teste", async () => {
    const testCaseToUpdate: TestCase = {
      id: "10",
      title: "Teste Atualizado",
      description: "Desc Atualizada",
      type: "Alternative",
      precondition: "Pre Atualizada",
      steps: "Steps Atualizados",
      expectedResult: "Result Atualizado",
      useCaseId: "uc-001",
      createdAt: "2025-01-01"
    };

    const returnedDbData = {
      id: 10,
      title: "Teste Atualizado",
      description: "Desc Atualizada",
      type: "Alternative",
      precondition: "Pre Atualizada",
      steps: "Steps Atualizados",
      expected_result: "Result Atualizado",
      use_case_id: "uc-001",
      created_at: "2025-01-01"
    };
    const mockSingle = vi.fn().mockResolvedValue({ data: returnedDbData, error: null });
    const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as Mock).mockReturnValue({ update: mockUpdate });

    const result = await useCaseService.updateTestCase(testCaseToUpdate);

    expect(supabase.from).toHaveBeenCalledWith("test_cases");
    expect(mockUpdate).toHaveBeenCalledWith({
      title: testCaseToUpdate.title,
      description: testCaseToUpdate.description,
      type: testCaseToUpdate.type,
      precondition: testCaseToUpdate.precondition,
      steps: testCaseToUpdate.steps,
      expected_result: testCaseToUpdate.expectedResult,
    });
    expect(mockEq).toHaveBeenCalledWith("id", testCaseToUpdate.id);
    expect(result.title).toBe("Teste Atualizado");
  });

  it("deve deletar um caso de teste por ID", async () => {
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
    (supabase.from as Mock).mockReturnValue({ delete: mockDelete });

    const result = await useCaseService.deleteTestCaseById("10");

    expect(supabase.from).toHaveBeenCalledWith("test_cases");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", "10");
    expect(result).toBe(true);
  });

  it("deve lançar erro quando o supabase falhar ao buscar casos de uso", async () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: "Erro de conexão" } 
        })
      })
    });

    (supabase.from as Mock).mockReturnValue({ select: mockSelect }); 
    
    await expect(useCaseService.getUseCases("proj-123")).rejects.toThrow("Erro de conexão");
  });
});