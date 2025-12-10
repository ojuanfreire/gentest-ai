import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Workflow,
  ArrowLeft,
  Search,
  RefreshCw,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

import { useUseCases } from "../hooks/useUseCases";
import { UseCaseCard } from "../components/UseCaseCard";
import { Button } from "../../../components/common/Button";
import { CreateUseCaseModal } from "../components/CreateUseCaseModal";
import type { UseCaseFormData } from "../components/CreateUseCaseModal";
import { EditUseCaseModal } from "../components/EditUseCaseModal";
import { DeleteConfirmationModal } from "../../../components/common/DeleteConfirmationModal";
import type { UseCase } from "../../../types/index";

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

export const ProjectArtifactsScreen = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const {
    loading,
    error,
    useCases,
    isSubmitting,
    fetchUseCases,
    handleCreateUseCase,
    handleEditUseCase,
    handleDeleteUseCase,
  } = useUseCases();

  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [useCaseToDelete, setUseCaseToDelete] = useState<UseCase | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (projectId) {
      fetchUseCases(projectId);
    }
  }, [projectId, fetchUseCases]);

  const handleCreateFormSubmit = async (data: UseCaseFormData) => {
    if (!projectId) return;
    const success = await handleCreateUseCase(data, projectId);
    if (success) setIsCreateModalOpen(false);
  };

  const handleViewClick = (useCase: UseCase) => {
    navigate(`/use-case/${useCase.id}`);
  };

  const handleOpenEditModal = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
    setIsEditModalOpen(true);
  };

  const handleEditFormSubmit = async (updatedUseCase: UseCase) => {
    const success = await handleEditUseCase(updatedUseCase);
    if (success) {
      setSelectedUseCase(null);
      setIsEditModalOpen(false);
    }
  };

  const handleOpenDeleteModal = (useCase: UseCase) => {
    setUseCaseToDelete(useCase);
  };

  const handleConfirmDelete = async () => {
    if (!useCaseToDelete) return;
    const success = await handleDeleteUseCase(useCaseToDelete.id);
    if (success) setUseCaseToDelete(null);
  };

  const filteredUseCases = useCases.filter((useCase) =>
    useCase.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLoading = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="h-56 w-full animate-pulse rounded-2xl bg-slate-800/50 border border-slate-800"
        ></div>
      ))}
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-900/10 p-8 text-center backdrop-blur-sm">
      <div className="mb-3 rounded-full bg-red-500/10 p-3 text-red-400">
        <RefreshCw size={24} />
      </div>
      <p className="text-lg font-semibold text-white">Erro ao carregar</p>
      <p className="text-sm text-red-300/70 mb-4">{error}</p>
      <Button
        onClick={() => projectId && fetchUseCases(projectId)}
        className="rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-200 hover:bg-red-600/30 border border-red-500/30"
      >
        Tentar Novamente
      </Button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border-2 border-dashed border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
      <div className="group mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800 shadow-inner ring-1 ring-white/5 transition-transform hover:scale-110 hover:-rotate-3">
        <Workflow
          size={40}
          className="text-blue-500 opacity-80 group-hover:opacity-100"
        />
      </div>
      <h3 className="text-xl font-bold text-white">
        Nenhum caso de uso encontrado
      </h3>
      <p className="mt-2 max-w-sm text-slate-400">
        Este projeto está vazio. Comece definindo os casos de uso para gerar
        seus testes automatizados.
      </p>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
      >
        <Plus size={20} />
        Criar Primeiro Caso de Uso
      </Button>
    </div>
  );

  const renderUseCases = () => (
    <motion.div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {filteredUseCases.map((useCase) => (
        <motion.div
          key={useCase.id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <UseCaseCard
            useCase={useCase}
            onViewClick={handleViewClick}
            onEditClick={handleOpenEditModal}
            onDeleteClick={handleOpenDeleteModal}
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
        Nenhum caso de uso encontrado
      </h3>
      <p className="text-slate-400">
        Não encontramos casos de uso com o termo "{searchTerm}"
      </p>
      <Button
        onClick={() => setSearchTerm("")}
        className="mt-4 text-blue-400 hover:text-blue-300 bg-transparent border-none"
      >
        Limpar busca
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
      <header className="top-0 z-30 border-b border-white/5 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60 bg-opacity-0">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            className="group flex w-fit items-center gap-2 bg-transparent pl-0 text-slate-400 transition-colors hover:bg-transparent hover:text-white border-none"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Voltar aos Projetos
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Artefatos do Projeto
              </h1>
              <p className="mt-1 text-slate-400">
                Gerencie os casos de uso e requisitos deste projeto.
              </p>
            </div>
          </div>

          <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 border-b-2 border-blue-500 pb-4 text-sm font-bold text-white">
                <FileText size={16} />
                Casos de Uso
                {!loading && (
                  <span className="ml-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
                    {useCases.length}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-slate-400 focus-within:border-blue-500/50 focus-within:text-blue-400 transition-colors">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Buscar caso de uso..."
                    className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-48"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-500 hover:scale-105 disabled:opacity-50"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Novo Caso de Uso</span>
              </Button>
            </div>
          </div>

          <div className="min-h-[400px]">
            {loading && renderLoading()}
            {!loading && error && renderError()}
            {!loading && !error && useCases.length === 0 && renderEmptyState()}
            {!loading &&
              !error &&
              useCases.length > 0 &&
              filteredUseCases.length === 0 &&
              renderNoSearchResults()}
            {!loading &&
              !error &&
              filteredUseCases.length > 0 &&
              renderUseCases()}
          </div>
        </div>
      </main>

      <CreateUseCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateFormSubmit}
        isSubmitting={isSubmitting}
      />

      <EditUseCaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditFormSubmit}
        isSubmitting={isSubmitting}
        useCaseToEdit={selectedUseCase}
      />

      <DeleteConfirmationModal
        isOpen={!!useCaseToDelete}
        onClose={() => setUseCaseToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
        title="Excluir Caso de Uso"
        message={`Tem certeza que deseja excluir "${useCaseToDelete?.name}"? Esta ação não pode ser desfeita e todos os testes associados serão removidos.`}
      />
    </motion.div>
  );
};
