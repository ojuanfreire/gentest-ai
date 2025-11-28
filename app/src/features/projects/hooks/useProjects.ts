import { useState, useEffect, useCallback } from "react";
import type { Project } from "../../../types";
import { projectService } from "../services/projectService";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao carregar projetos.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega projetos ao montar
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (name: string, description: string) => {
    try {
      const newProject = await projectService.createProject(name, description);
      setProjects((prev) => [newProject, ...prev]);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao criar projeto.");
      }
      return false;
    }
  };

  const editProject = async (id: string, updates: Partial<Project>) => {
    try {
      const updatedProject = await projectService.updateProject(id, updates);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updatedProject : p))
      );
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao atualizar projeto.");
      }
      return false;
    }
  };

  const removeProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Erro ao remover projeto.");
      }
      return false;
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
  };
};
