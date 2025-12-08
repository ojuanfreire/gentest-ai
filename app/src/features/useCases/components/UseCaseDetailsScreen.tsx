import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";

import { useUseCases } from "../hooks/useUseCases";
import { Button } from "../../../components/common/Button";
import { TestCaseList } from "../components/TestCaseList";
import { EditUseCaseModal } from "../components/EditUseCaseModal";
import { DeleteConfirmationModal } from "../../../components/common/DeleteConfirmationModal";
import type { UseCase } from "../../../types/index";

export const UseCaseDetailsScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    handleDeleteUseCase,
    handleEditUseCase,
    isSubmitting,
    getUseCaseById,
  } = useUseCases();

  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      console.warn("ID não fornecido, retornando...");
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

    const success = await handleDeleteUseCase(useCase.id);
    if (success) {
      setIsDeleteModalOpen(false);
      navigate(-1);
    }
  };

  const handleEditSubmit = async (updatedData: UseCase) => {
    const success = await handleEditUseCase(updatedData);
    if (success) {
      setUseCase(updatedData);
      setIsEditModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500"></div>
          <p>Carregando detalhes...</p>
        </div>
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
    <div className="flex min-h-screen w-full flex-col bg-slate-900 text-white">
      <header className="border-b border-slate-700 bg-slate-800/50 px-6 py-4">
        <div className="mx-auto max-w-5xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-transparent pl-0 text-slate-400 hover:bg-transparent hover:text-white border-none w-fit"
          >
            <ArrowLeft size={20} />
            Voltar aos Artefatos
          </Button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition-colors shadow-sm border-none"
            >
              <Trash2 size={18} /> Excluir
            </Button>

            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm border-none"
            >
              <Edit2 size={18} /> Editar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-8 lg:p-10">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
              {useCase.name}
            </h1>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 break-all">
            ID: {useCase.id}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 sm:p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Informações do Caso de Uso
            </h3>

            <div className="min-h-[60px] w-full rounded-md border border-slate-600 bg-slate-900/50 p-4 text-slate-200 whitespace-pre-wrap break-words text-sm sm:text-base">
              {useCase.description || "Sem descrição."}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                  Ator Principal
                </h4>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-3 text-sm text-slate-300 break-words">
                  {useCase.actor}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                  Criado em
                </h4>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-3 text-sm text-slate-300">
                  {new Date(
                    useCase.createdAt || Date.now()
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                Pré-condições
              </h4>
              <div className="rounded-md border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">
                {useCase.preconditions || "Nenhuma pré-condição definida."}
              </div>
            </div>

            <div className="mt-6 mb-4 pb-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-blue-400">
                  Fluxo Principal
                </h4>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words h-full">
                  {useCase.mainFlow}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-yellow-500">
                  Fluxos Alternativos
                </h4>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words h-full">
                  {useCase.alternativeFlows || "Nenhum fluxo alternativo."}
                </div>
              </div>
            </div>
          </div>

          <section>
            <TestCaseList useCaseId={useCase.id} />
          </section>
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
        message={`Tem certeza que deseja excluir "${useCase.name}"? Todos os casos de teste associados também serão perdidos.`}
      />
    </div>
  );
};
