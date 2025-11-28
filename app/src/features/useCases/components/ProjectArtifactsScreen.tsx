import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Workflow } from "lucide-react";

import { useUseCases } from "../hooks/useUseCases";
import { UseCaseCard } from "../components/UseCaseCard";
import { Button } from "../../../components/common/Button";
import { CreateUseCaseModal } from "../components/CreateUseCaseModal";
import type { UseCaseFormData } from "../components/CreateUseCaseModal";
import { EditUseCaseModal } from "../components/EditUseCaseModal";
import { DeleteConfirmationModal } from "../../../components/common/DeleteConfirmationModal";
import type { UseCase } from "../../../types/index";
import { Header } from "../../../components/common/Header";

export const ProjectArtifactsScreen = () => {
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

  // Estados de Modais
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Estados de Seleção
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [useCaseToDelete, setUseCaseToDelete] = useState<UseCase | null>(null);

  /*
  useEffect(() => {
    fetchUseCases("proj-123");
  }, [fetchUseCases]); */

  const handleCreateFormSubmit = async (data: UseCaseFormData) => {
    const success = await handleCreateUseCase(data);
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

  const renderLoading = () => (
    <div className="flex h-64 flex-col items-center justify-center text-slate-400">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500 mb-4"></div>
      <p>Carregando casos de uso...</p>
    </div>
  );

  const renderError = () => (
    <div className="mt-10 rounded-md bg-red-900/50 p-4 text-center text-red-300">
      <p>Ocorreu um erro:</p>
      <p className="font-medium">{error}</p>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-slate-800 p-6">
        <Workflow size={48} className="text-slate-600" />
      </div>
      <h3 className="text-xl font-semibold text-white">
        Nenhum caso de uso encontrado
      </h3>
      <p className="mt-2 max-w-sm text-slate-400">
        Este projeto ainda não possui casos de uso. Crie o primeiro para começar
        a gerar testes.
      </p>
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg shadow-blue-900/20"
      >
        <Plus size={20} />
        Criar primeiro caso de uso
      </Button>
    </div>
  );

  const renderUseCases = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {useCases.map((useCase) => (
        <UseCaseCard
          key={useCase.id}
          useCase={useCase}
          onViewClick={handleViewClick}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleOpenDeleteModal}
        />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-900 text-white">
      <Header />

      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold text-white">
            Artefatos do Projeto
          </h1>

          <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-semibold text-slate-200 flex items-center gap-2">
              Casos de Uso
              {!loading && (
                <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  {useCases.length}
                </span>
              )}
            </h2>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={20} />
              Novo Caso de Uso
            </Button>
          </div>

          <div className="min-h-[400px]">
            {loading && renderLoading()}
            {!loading && error && renderError()}
            {!loading && !error && useCases.length === 0 && renderEmptyState()}
            {!loading && !error && useCases.length > 0 && renderUseCases()}
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
        message={`Tem certeza que deseja excluir "${useCaseToDelete?.title}"? Esta ação não pode ser desfeita e todos os testes associados serão removidos.`}
      />
    </div>
  );
};
