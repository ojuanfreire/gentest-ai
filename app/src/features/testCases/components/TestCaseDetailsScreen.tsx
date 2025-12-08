import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Wand2,
  Code,
  Eye,
  Trash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useTestCaseDetails } from "../hooks/useTestCaseDetails";
import { Button } from "../../../components/common/Button";
import { DeleteConfirmationModal } from "../../../components/common/DeleteConfirmationModal";
import { EditTestCaseModal } from "../components/EditTestCaseModal";
import type { SkeletonFramework, TestCase } from "../../../types";

const ITEMS_PER_PAGE = 5;

export const TestCaseDetailsScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    loading,
    error,
    testCase,
    skeletons,
    isSubmitting,
    generateSkeleton,
    handleDeleteTestCase,
    handleEditTestCase,
    handleDeleteSkeleton,
  } = useTestCaseDetails(id);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedFramework, setSelectedFramework] = useState<SkeletonFramework>(
    "JavaScript + Cypress"
  );

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(skeletons.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSkeletons = skeletons.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleConfirmDelete = async () => {
    const success = await handleDeleteTestCase();
    if (success) {
      setIsDeleteModalOpen(false);
      navigate(-1);
    }
  };

  const handleConfirmEdit = async (updatedData: TestCase) => {
    const success = await handleEditTestCase(updatedData);
    if (success) {
      setIsEditModalOpen(false);
    }
  };

  const handleGenerateClick = async () => {
    await generateSkeleton(selectedFramework);
  };

  const handleViewSkeleton = (skeletonId: string) => {
    navigate(`/skeleton/${skeletonId}`);
  };

  const handleDeleteSkeletonClick = async (skeletonId: string) => {
    await handleDeleteSkeleton(skeletonId);
    if (currentSkeletons.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-blue-500"></div>
          <p>Carregando caso de teste...</p>
        </div>
      </div>
    );
  }

  if (error || !testCase) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
        <h2 className="mb-4 text-xl font-bold">Caso de Teste não encontrado</h2>
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

      <header className="border-b border-slate-700 bg-slate-800/50 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-5xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={() => navigate(-1)}
            className="flex w-fit items-center gap-2 bg-transparent pl-0 text-slate-400 hover:bg-transparent hover:text-white"
          >
            <ArrowLeft size={20} />
            Voltar ao Caso de Uso
          </Button>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 transition-colors shadow-sm border-none sm:flex-none"
            >
              <Trash2 size={18} /> Excluir
            </Button>

            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm border-none sm:flex-none"
            >
              <Edit2 size={18} /> Editar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-8 lg:p-10">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-2xl font-bold text-white sm:text-3xl break-words">
              {testCase.title}
            </h1>
          </div>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm break-all">
            ID: {testCase.id}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 sm:p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Informações do Caso de Teste
            </h3>

            <div className="min-h-[80px] w-full rounded-md border border-slate-600 bg-slate-900/50 p-4 text-sm text-slate-200 whitespace-pre-wrap break-words sm:text-base">
              {testCase.description || "Sem descrição."}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                  Passos
                </h4>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">
                  {testCase.steps}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                  Resultado Esperado
                </h4>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words">
                  {testCase.expectedResult}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">
              Esqueleto de Código
            </h3>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Selecione o Framework
                  </label>
                  <select
                    value={selectedFramework}
                    onChange={(e) =>
                      setSelectedFramework(e.target.value as SkeletonFramework)
                    }
                    className="w-full rounded-md border border-slate-600 bg-slate-700 p-2.5 text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  >
                    <option value="JavaScript + Cypress">
                      JavaScript + Cypress
                    </option>
                    <option value="Python + Playwright">
                      Python + Playwright
                    </option>
                  </select>
                </div>

                <Button
                  onClick={handleGenerateClick}
                  disabled={isSubmitting}
                  className="flex h-[42px] w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm border-none whitespace-nowrap sm:w-auto"
                >
                  <Wand2 size={18} />
                  {isSubmitting ? "Gerando..." : "Gerar Esqueleto"}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              Gerados Anteriormente
            </h3>

            {skeletons.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-8 text-center text-sm text-slate-400">
                Nenhum esqueleto gerado para este caso de teste ainda.
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {currentSkeletons.map((sk) => (
                    <div
                      key={sk.id}
                      className="flex flex-col items-start gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex w-full items-center gap-3 overflow-hidden">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-slate-700 text-blue-400">
                          <Code size={20} />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="block truncate font-medium text-slate-200">
                            {sk.framework}
                          </span>
                          <span className="text-xs text-slate-500">
                            Gerado em:{" "}
                            {new Date(sk.createdAt).toLocaleDateString()} às{" "}
                            {new Date(sk.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
                        <button
                          onClick={() => handleViewSkeleton(sk.id)}
                          className="flex items-center gap-1.5 rounded bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-slate-700 hover:text-blue-300 transition-colors sm:bg-transparent sm:p-0 sm:text-sm"
                        >
                          <Eye size={16} />{" "}
                          <span className="sm:hidden lg:inline">Detalhes</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSkeletonClick(sk.id)}
                          className="flex items-center gap-1.5 rounded bg-red-900/20 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-900/40 hover:text-red-400 transition-colors sm:bg-transparent sm:p-0 sm:text-sm sm:ml-2"
                        >
                          <Trash size={16} />{" "}
                          <span className="sm:hidden lg:inline">Deletar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {skeletons.length > ITEMS_PER_PAGE && (
                  <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-4 sm:flex-row">
                    <span className="text-xs text-slate-400 sm:text-sm">
                      Mostrando{" "}
                      <span className="font-medium text-white">
                        {startIndex + 1}
                      </span>{" "}
                      até{" "}
                      <span className="font-medium text-white">
                        {Math.min(
                          startIndex + ITEMS_PER_PAGE,
                          skeletons.length
                        )}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium text-white">
                        {skeletons.length}
                      </span>{" "}
                      resultados
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="flex h-8 w-8 items-center justify-center rounded bg-slate-700 text-white transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Página Anterior"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <span className="px-2 text-sm font-medium text-white">
                        {currentPage} de {totalPages}
                      </span>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded bg-slate-700 text-white transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Próxima Página"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
        title="Excluir Caso de Teste"
        message={`Tem certeza que deseja excluir "${testCase.title}"? Todos os esqueletos gerados também serão perdidos.`}
      />

      <EditTestCaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleConfirmEdit}
        isSubmitting={isSubmitting}
        testCaseToEdit={testCase}
      />
    </div>
  );
};
