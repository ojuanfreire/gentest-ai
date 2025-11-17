import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

import { useUseCases } from "../hooks/useUseCases";
import { Button } from "../../../components/common/Button";
import { TestCaseList } from "../components/TestCaseList";
import { EditUseCaseModal } from "../components/EditUseCaseModal";
import { DeleteConfirmationModal } from "../../../components/common/DeleteConfirmationModal"; // Ajuste o caminho se necessário
import type { UseCase } from "../../../types/index";

export const UseCaseDetailsScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { handleDeleteUseCase, handleEditUseCase, isSubmitting, getUseCaseById } =
    useUseCases();

  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados dos Modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate(-1);
      return;
    }
    
    const fetchDetails = async () => {
      setIsLoading(true);
      const data = await getUseCaseById(id);
      if (data) {
        setUseCase(data);
      } else {
        setUseCase(null);
      }
      setIsLoading(false);
    };
      fetchDetails();
  }, [id, getUseCaseById, navigate]);

  const handleConfirmDelete = async () => {
    if (!useCase) return;

    const success = await handleDeleteUseCase(useCase.id); // Chama o hook real
    if (success) {
      setIsDeleteModalOpen(false);
      navigate(-1);
    }
  };

  const handleEditSubmit = async (updatedData: UseCase) => {
    setUseCase(updatedData);
    setIsEditModalOpen(false);
    alert("Caso de uso editado localmente!");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        Carregando detalhes...
      </div>
    );
  }

  if (!useCase) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
        <h2 className="mb-4 text-xl font-bold">Caso de Uso não encontrado</h2>
        <Button
          onClick={() => navigate(-1)}
          className="rounded-md bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white">
      {/* Header da Página */}
      <header className="border-b border-slate-700 bg-slate-800/50 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-transparent pl-0 text-slate-400 hover:bg-transparent hover:text-white"
          >
            <ArrowLeft size={20} />
            Voltar aos Artefatos
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition-colors shadow-sm border-none"
            >
              <Trash2 size={18} /> Excluir
            </Button>

            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm border-none"
            >
              <Edit2 size={18} /> Editar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6 lg:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{useCase.title}</h1>
          <p className="mt-2 text-lg text-slate-400">{useCase.description}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-6 md:col-span-1">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Detalhes
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="block text-xs text-slate-400">
                    Ator Principal
                  </span>
                  <span className="font-medium text-slate-200">
                    {useCase.actor}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">
                    Data de Criação
                  </span>
                  <span className="font-medium text-slate-200">
                    {new Date(
                      useCase.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-400">
                    ID do Projeto
                  </span>
                  <span className="font-medium text-slate-200">
                    {useCase.projectId}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Pré-condições
              </h3>
              <p className="text-sm text-slate-300">{useCase.preconditions}</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="mb-4 text-xl font-semibold text-white">Fluxos</h3>
              <div className="space-y-4">
                <div className="rounded-md border border-slate-700 bg-slate-800 p-5">
                  <h4 className="mb-2 font-medium text-blue-400">
                    Fluxo Principal
                  </h4>
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300">
                    {useCase.mainFlow}
                  </pre>
                </div>

                {useCase.alternativeFlows && (
                  <div className="rounded-md border border-slate-700 bg-slate-800 p-5">
                    <h4 className="mb-2 font-medium text-yellow-500">
                      Fluxos Alternativos
                    </h4>
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300">
                      {useCase.alternativeFlows}
                    </pre>
                  </div>
                )}
              </div>
            </section>

            <section>
              <TestCaseList useCaseId={useCase.id} />
            </section>
          </div>
        </div>
      </main>

      <EditUseCaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
        useCaseToEdit={useCase}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
        title="Excluir Caso de Uso"
        message={`Tem certeza que deseja excluir "${useCase.title}"? Todos os casos de teste associados também serão perdidos.`}
      />
    </div>
  );
};
