import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderOpen, LayoutGrid, Search, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "../components/ProjectCard";
import { Button } from "../../../components/common/Button";
import type { Project } from "../../../types";
import { CreateProjectModal, type ProjectFormData } from "./CreateProjectModal";
import { EditProjectModal } from "./EditProjectModal";
import { DeleteConfirmationModal } from "../../../components/common/DeleteConfirmationModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }, // Removido ease: "easeOut"
  },
};

export const ProjectMenuScreen = () => {
  const navigate = useNavigate();

  const { loading, error, projects, addProject, editProject, removeProject } =
    useProjects();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleProjectClick = (project: Project) => {
    navigate(`/project/${project.id}/artifacts`);
  };

  const handleCreateProjectSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    const success = await addProject(data.name, data.description);
    setIsSubmitting(false);
    if (success) setIsCreateModalOpen(false);
  };

  const handleEditClick = (project: Project) => {
    setProjectToEdit(project);
    setIsEditModalOpen(true);
  };

  const handleEditProjectSubmit = async (updatedData: Project) => {
    setIsSubmitting(true);
    const success = await editProject(updatedData.id, {
      name: updatedData.name,
      description: updatedData.description,
    });
    setIsSubmitting(false);
    if (success) {
      setIsEditModalOpen(false);
      setProjectToEdit(null);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsSubmitting(true);
    const success = await removeProject(projectToDelete.id);
    setIsSubmitting(false);
    if (success) {
      setProjectToDelete(null);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLoading = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-48 w-full animate-pulse rounded-2xl bg-slate-800/50 border border-slate-800"
        ></div>
      ))}
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-900/10 p-10 text-center backdrop-blur-sm">
      <div className="mb-4 rounded-full bg-red-500/10 p-3 text-red-400">
        <RefreshCw size={32} />
      </div>
      <p className="text-lg font-semibold text-white">
        Não foi possível carregar os projetos
      </p>
      <p className="mt-1 text-sm text-red-300/70">{error}</p>
      <Button
        onClick={() => window.location.reload()}
        className="mt-6 rounded-lg bg-red-600/20 px-6 py-2 text-red-200 hover:bg-red-600/30 border border-red-500/30 transition-colors"
      >
        Tentar novamente
      </Button>
    </div>
  );

  const renderProjectsList = () => (
    <motion.div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {filteredProjects.map((project) => (
        <motion.div key={project.id} variants={itemVariants}>
          <ProjectCard
            project={project}
            onClick={handleProjectClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </motion.div>
      ))}
    </motion.div>
  );

  const renderNoSearchResults = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-slate-800/50 p-4 text-slate-500">
        <Search size={32} />
      </div>
      <h3 className="text-lg font-medium text-white">
        Nenhum projeto encontrado
      </h3>
      <p className="text-slate-400">
        Não encontramos projetos com o termo "{searchTerm}"
      </p>
      <Button
        onClick={() => setSearchTerm("")}
        className="mt-4 text-blue-400 hover:text-blue-300 bg-transparent border-none"
      >
        Limpar busca
      </Button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/30 p-10 text-center transition-all hover:border-slate-700 hover:bg-slate-900/50">
      <div className="group mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800 shadow-inner ring-1 ring-white/5 transition-transform duration-500 hover:scale-110 hover:rotate-3">
        <FolderOpen
          size={40}
          className="text-blue-500 opacity-80 transition-opacity group-hover:opacity-100"
        />
      </div>
      <h3 className="text-2xl font-bold text-white">
        Nenhum projeto encontrado
      </h3>
      <p className="mt-3 max-w-md text-slate-400">
        Parece que você ainda não criou nenhum projeto. Comece criando um
        workspace para organizar seus casos de uso.
      </p>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40"
      >
        <Plus size={20} />
        Criar Primeiro Projeto
      </Button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen w-full flex-col bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] text-white"
    >
      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Dashboard
              </h1>
              <p className="mt-2 text-slate-400">
                Gerencie seus projetos e testes automatizados
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-slate-400 focus-within:border-blue-500/50 focus-within:text-blue-400 transition-colors">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Buscar projetos..."
                  className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={loading || isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Novo Projeto</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
            <button className="flex items-center gap-2 border-b-2 border-blue-500 pb-4 text-sm font-bold text-white">
              <LayoutGrid size={16} /> Todos os Projetos
              {!loading && (
                <span className="ml-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
                  {projects.length}
                </span>
              )}
            </button>
          </div>

          <div className="min-h-[400px]">
            {loading && renderLoading()}
            {!loading && error && renderError()}
            {!loading && !error && projects.length === 0 && renderEmptyState()}
            {!loading &&
              !error &&
              projects.length > 0 &&
              filteredProjects.length === 0 &&
              renderNoSearchResults()}
            {!loading &&
              !error &&
              filteredProjects.length > 0 &&
              renderProjectsList()}
          </div>
        </div>
      </main>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProjectSubmit}
        isSubmitting={isSubmitting}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditProjectSubmit}
        isSubmitting={isSubmitting}
        projectToEdit={projectToEdit}
      />

      <DeleteConfirmationModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDeleteProject}
        isDeleting={isSubmitting}
        title="Excluir Projeto"
        message={`Tem certeza que deseja excluir o projeto "${projectToDelete?.name}"? Todos os casos de teste associados serão perdidos.`}
      />
    </motion.div>
  );
};
