import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { projectService } from "../services/projectService";
import { supabase } from "../../../api/supabaseClient";
import type { Project } from "../../../types";

const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock("../../../api/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    })),
  },
}));

mockSelect.mockReturnValue({ order: mockOrder, eq: mockEq, single: mockSingle });
mockInsert.mockReturnValue({ select: () => ({ single: mockSingle }) });
mockUpdate.mockReturnValue({ eq: () => ({ select: () => ({ single: mockSingle }) }) });
mockDelete.mockReturnValue({ eq: mockEq });

describe("projectService", () => {
  const mockUser = { id: "user-123", email: "test@example.com" };
  
  const mockDbProject = {
    id: 1,
    user_id: "user-123",
    name: "Projeto Teste",
    description: "Descrição do projeto",
    created_at: "2025-01-01T10:00:00Z",
  };

  const mockProject: Project = {
    id: "1",
    userId: "user-123",
    name: "Projeto Teste",
    description: "Descrição do projeto",
    createdAt: "2025-01-01T10:00:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProjects", () => {
    it("deve buscar e mapear os projetos corretamente", async () => {
      mockOrder.mockResolvedValue({ data: [mockDbProject], error: null });

      const result = await projectService.getProjects();

      expect(supabase.from).toHaveBeenCalledWith("projects");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: false });

      expect(result).toEqual([mockProject]);
    });

    it("deve lançar erro se a busca falhar", async () => {
      mockOrder.mockResolvedValue({ data: null, error: { message: "Erro DB" } });

      await expect(projectService.getProjects()).rejects.toThrow("Erro DB");
    });
  });

  describe("createProject", () => {
    it("deve criar um projeto se o usuário estiver autenticado", async () => {
      (supabase.auth.getUser as Mock).mockResolvedValue({ data: { user: mockUser } });
      mockSingle.mockResolvedValue({ data: mockDbProject, error: null });

      const result = await projectService.createProject("Projeto Teste", "Descrição do projeto");

      expect(supabase.auth.getUser).toHaveBeenCalled();

      expect(mockInsert).toHaveBeenCalledWith({
        name: "Projeto Teste",
        description: "Descrição do projeto",
        user_id: mockUser.id,
      });

      expect(result).toEqual(mockProject);
    });

    it("deve lançar erro se o usuário não estiver autenticado", async () => {
      (supabase.auth.getUser as Mock).mockResolvedValue({ data: { user: null } });

      await expect(
        projectService.createProject("Nome", "Desc")
      ).rejects.toThrow("Usuário não autenticado.");
    });

    it("deve lançar erro se a inserção falhar", async () => {
      (supabase.auth.getUser as Mock).mockResolvedValue({ data: { user: mockUser } });
      mockSingle.mockResolvedValue({ data: null, error: { message: "Erro ao inserir" } });

      await expect(
        projectService.createProject("Nome", "Desc")
      ).rejects.toThrow("Erro ao inserir");
    });
  });

  describe("updateProject", () => {
    it("deve atualizar o projeto corretamente", async () => {
      const updates = { name: "Nome Atualizado" };
      const updatedDbProject = { ...mockDbProject, name: "Nome Atualizado" };
      const updatedProject = { ...mockProject, name: "Nome Atualizado" };

      mockSingle.mockResolvedValue({ data: updatedDbProject, error: null });

      const result = await projectService.updateProject("1", updates);

      expect(mockUpdate).toHaveBeenCalledWith({ name: "Nome Atualizado" });
      
      expect(result).toEqual(updatedProject);
    });

    it("deve lançar erro se a atualização falhar", async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: "Erro Update" } });

      await expect(
        projectService.updateProject("1", { name: "Novo" })
      ).rejects.toThrow("Erro Update");
    });
  });

  describe("deleteProject", () => {
    it("deve deletar o projeto com sucesso", async () => {
      mockEq.mockResolvedValue({ error: null });

      await projectService.deleteProject("1");

      expect(mockDelete).toHaveBeenCalled();
    });

    it("deve lançar erro se a deleção falhar", async () => {
      mockEq.mockResolvedValue({ error: { message: "Erro Delete" } });

      await expect(projectService.deleteProject("1")).rejects.toThrow("Erro Delete");
    });
  });
});