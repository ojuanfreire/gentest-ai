import { supabase } from "../../../api/supabaseClient";
import type { Project } from "../../../types";

const fromDbToProject = (dbData: any): Project => ({
  id: dbData.id.toString(),
  userId: dbData.user_id,
  name: dbData.name,
  description: dbData.description,
  createdAt: dbData.created_at,
});

const fromProjectToDb = (project: Partial<Project>) => ({
  name: project.name,
  description: project.description,
});

const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar projetos:", error);
    throw new Error(error.message);
  }

  return data.map(fromDbToProject);
};

const createProject = async (name: string, description: string): Promise<Project> => {
  const { data: { user }, } = await supabase.auth.getUser();

  if (!user) throw new Error("Usuário não autenticado.");

  const dbPayload = {
    name,
    description,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert(dbPayload)
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar projeto:", error);
    throw new Error(error.message);
  }

  return fromDbToProject(data);
};

const updateProject = async ( id: string, updates: Partial<Project>): Promise<Project> => {
  const dbPayload = fromProjectToDb(updates);

  const { data, error } = await supabase
    .from("projects")
    .update(dbPayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar projeto:", error);
    throw new Error(error.message);
  }

  return fromDbToProject(data);
};

const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar projeto:", error);
    throw new Error(error.message);
  }
};

export const projectService = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};