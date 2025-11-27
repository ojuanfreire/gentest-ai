import { useState, useEffect, useCallback } from "react";
import type { Project } from "../../../types"; // Ajuste o caminho

// --- MOCK DATA ---
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
// -----------------

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

  const createProject = async (name: string, description: string) => {
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

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    loading,
    error,
    projects,
    isSubmitting,
    createProject,
  };
};
