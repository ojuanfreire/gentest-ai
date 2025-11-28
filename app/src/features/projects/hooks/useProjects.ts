import { useState, useEffect, useCallback } from "react";
import type { Project } from "../../../types";

const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-123",
    name: "Projeto 1",
    description:
      "Descrição do projeto de testes automatizados para o sistema financeiro.",
    ownerId: "user-001",
    createdAt: "2024-10-20T10:00:00Z",
  },
  {
    id: "proj-456",
    name: "Projeto E-commerce",
    description: "Suite de testes para a nova plataforma de vendas online.",
    ownerId: "user-001",
    createdAt: "2024-11-05T14:30:00Z",
  },
  {
    id: "proj-789",
    name: "App Mobile",
    description: "Testes E2E para o aplicativo mobile em React Native.",
    ownerId: "user-002",
    createdAt: "2024-11-10T09:15:00Z",
  },
];

export const useProjects = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Mock: Buscando projetos...");
      await new Promise((resolve) => setTimeout(resolve, 600));
      setProjects(MOCK_PROJECTS);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar projetos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (name: string, description: string) => {
    setIsSubmitting(true);
    try {
      console.log("Mock: Criando projeto...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name,
        description,
        ownerId: "user-001",
        createdAt: new Date().toISOString(),
      };

      setProjects((prev) => [newProject, ...prev]);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProject = async (updatedProject: Project) => {
    setIsSubmitting(true);
    try {
      console.log("Mock: Editando projeto...", updatedProject);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProjects((prev) =>
        prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setIsSubmitting(true);
    try {
      console.log("Mock: Deletando projeto...", projectId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    loading,
    error,
    projects,
    isSubmitting,
    handleCreateProject,
    handleEditProject,
    handleDeleteProject,
    refreshProjects: fetchProjects, // Útil expor caso precise recarregar manualmente
  };
};
