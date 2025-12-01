import { describe, it, expect, vi, beforeEach } from "vitest";
import { codeSkeletonService } from "../services/codeSkeletonService";
import { supabase } from "../../../api/supabaseClient";
import { aiGenerationService } from "../../ai/services/aiGenerationService";
import type { TestCase, CodeSkeleton } from "../../../types";

vi.mock("../../ai/services/aiGenerationService", () => ({
  aiGenerationService: {
    generateCodeSkeleton: vi.fn(),
  },
}));

const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();
const mockDelete = vi.fn();

vi.mock("../../../api/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      delete: mockDelete,
    })),
  },
}));

mockSelect.mockReturnValue({ eq: mockEq, order: mockOrder });
mockEq.mockReturnValue({ single: mockSingle, order: mockOrder });
mockInsert.mockReturnValue({ select: () => ({ single: mockSingle }) });
mockDelete.mockReturnValue({ eq: mockEq });

describe("codeSkeletonService", () => {
  const mockTestCase: TestCase = {
    id: "tc-1",
    useCaseId: "uc-1",
    title: "Teste Login",
    description: "Desc",
    type: "Happy Path",
    precondition: "None",
    steps: "Steps",
    expectedResult: "Success",
  };

  const mockDbSkeleton = {
    id: 100,
    test_case_id: "tc-1",
    framework: "JavaScript + Cypress",
    generated_code: "console.log('test')",
    created_at: "2025-01-01T12:00:00Z",
  };

  const mockSkeleton: CodeSkeleton = {
    id: "100",
    testCaseId: "tc-1",
    framework: "JavaScript + Cypress",
    generatedCode: "console.log('test')",
    createdAt: "2025-01-01T12:00:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSkeletonsByTestCaseId", () => {
    it("deve buscar e mapear a lista de esqueletos", async () => {
      mockOrder.mockResolvedValue({ data: [mockDbSkeleton], error: null });

      const result = await codeSkeletonService.getSkeletonsByTestCaseId("tc-1");

      // Verifica chamadas
      expect(supabase.from).toHaveBeenCalledWith("code_skeletons");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("test_case_id", "tc-1");
      expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });

      expect(result).toEqual([mockSkeleton]);
    });

    it("deve lançar erro se o banco falhar", async () => {
      mockOrder.mockResolvedValue({ data: null, error: { message: "Erro DB" } });
      await expect(codeSkeletonService.getSkeletonsByTestCaseId("tc-1")).rejects.toThrow("Erro DB");
    });
  });

  describe("getSkeletonById", () => {
    it("deve buscar um esqueleto específico", async () => {
      mockSingle.mockResolvedValue({ data: mockDbSkeleton, error: null });

      const result = await codeSkeletonService.getSkeletonById("100");

      expect(mockEq).toHaveBeenCalledWith("id", "100");
      expect(result).toEqual(mockSkeleton);
    });

    it("deve lançar erro se não encontrar ou falhar", async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: "Not Found" } });
      await expect(codeSkeletonService.getSkeletonById("999")).rejects.toThrow("Not Found");
    });
  });

  describe("generateSkeleton", () => {
    it("deve gerar código via IA e salvar no banco", async () => {
      const generatedCode = "console.log('test')";
      
      (aiGenerationService.generateCodeSkeleton as any).mockResolvedValue(generatedCode);
      
      mockSingle.mockResolvedValue({ data: mockDbSkeleton, error: null });

      const result = await codeSkeletonService.generateSkeleton(mockTestCase, "JavaScript + Cypress");

      expect(aiGenerationService.generateCodeSkeleton).toHaveBeenCalledWith(mockTestCase,"JavaScript + Cypress");

      expect(mockInsert).toHaveBeenCalledWith({
        test_case_id: mockTestCase.id,
        framework: "JavaScript + Cypress",
        generated_code: generatedCode,
      });

      expect(result).toEqual(mockSkeleton);
    });

    it("deve lançar erro se a IA falhar", async () => {
      (aiGenerationService.generateCodeSkeleton as any).mockRejectedValue(new Error("Erro IA"));

      await expect(
        codeSkeletonService.generateSkeleton(mockTestCase, "JavaScript + Cypress")
      ).rejects.toThrow("Erro IA");

      // Garante que não tentou salvar no banco se a IA falhou
      expect(mockInsert).not.toHaveBeenCalled();
    });

    it("deve lançar erro se o salvamento no banco falhar", async () => {
      (aiGenerationService.generateCodeSkeleton as any).mockResolvedValue("code");
      mockSingle.mockResolvedValue({ data: null, error: { message: "Erro Insert" } });

      await expect(
        codeSkeletonService.generateSkeleton(mockTestCase, "JavaScript + Cypress")
      ).rejects.toThrow("Erro ao salvar esqueleto: Erro Insert");
    });
  });

  describe("deleteSkeleton", () => {
    it("deve deletar o esqueleto com sucesso", async () => {
      mockEq.mockResolvedValue({ error: null });

      const result = await codeSkeletonService.deleteSkeleton("100");

      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "100");
      expect(result).toBe(true);
    });

    it("deve lançar erro se a deleção falhar", async () => {
      mockEq.mockResolvedValue({ error: { message: "Erro Delete" } });

      await expect(codeSkeletonService.deleteSkeleton("100")).rejects.toThrow("Erro Delete");
    });
  });
});