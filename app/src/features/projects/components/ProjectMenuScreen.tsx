import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderOpen } from "lucide-react";

import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "../components/ProjectCard";
import { Button } from "../../../components/common/Button";
import type { Project } from "../../../types";

export const ProjectMenuScreen = () => {
  const navigate = useNavigate();
  const { loading, error, projects, isSubmitting, createProject } =
    useProjects();

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}/artifacts`);
  };

  const handleCreateProject = async () => {
    const name = window.prompt("Nome do novo projeto:");
    if (name) {
      const desc = window.prompt("Descrição:") || "";
      await createProject(name, desc);
    }
  };

  const renderLoading = () => (
    <div className="flex h-64 flex-col items-center justify-center text-slate-400">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500 mb-4"></div>
      <p>Carregando seus projetos...</p>
    </div>
  );

  const renderError = () => (
    <div className="mt-10 rounded-md bg-red-900/20 border border-red-900/50 p-6 text-center">
      <p className="text-red-300 font-semibold">
        Não foi possível carregar os projetos
      </p>
      <p className="text-red-400/80 text-sm mt-1">{error}</p>
      <Button
        onClick={() => window.location.reload()}
        className="mt-4 bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-800/50"
      >
        Tentar novamente
      </Button>
    </div>
  );

  const renderProjectsList = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={handleProjectClick}
        />
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-slate-800 p-6">
        <FolderOpen size={48} className="text-slate-600" />
      </div>
      <h3 className="text-xl font-semibold text-white">
        Nenhum projeto encontrado
      </h3>
      <p className="mt-2 max-w-sm text-slate-400">
        Você ainda não possui nenhum projeto. Crie o primeiro para começar a
        gerenciar seus casos de teste.
      </p>
      <Button
        onClick={handleCreateProject}
        className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg shadow-blue-900/20"
      >
        <Plus size={20} />
        Criar meu primeiro projeto
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-slate-900 text-white">
      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Menu
            </h1>
            <p className="text-slate-400">
              Gerencie seus projetos e testes automatizados
            </p>
          </div>

          <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-semibold text-slate-200 flex items-center gap-2">
              Meus Projetos
              {!loading && (
                <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  {projects.length}
                </span>
              )}
            </h2>

            <Button
              onClick={handleCreateProject}
              disabled={loading || isSubmitting}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
            >
              <Plus size={20} />
              Novo Projeto
            </Button>
          </div>

          <div className="min-h-[400px]">
            {loading && renderLoading()}

            {!loading && error && renderError()}

            {!loading && !error && projects.length === 0 && renderEmptyState()}

            {!loading && !error && projects.length > 0 && renderProjectsList()}
          </div>
        </div>
      </main>
    </div>
  );
};
