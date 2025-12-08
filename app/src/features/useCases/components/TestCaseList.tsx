import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit2,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  SearchX,
} from "lucide-react";
import { useTestCases } from "../hooks/useTestCases";
import { EditTestCaseModal } from "../../testCases/components/EditTestCaseModal";
import { DeleteConfirmationModal } from "../../../components/common/DeleteConfirmationModal";
import type { TestCase } from "../../../types";

type TestCaseListProps = {
  useCaseId: string | number;
};

const ITEMS_PER_PAGE = 5;

export const TestCaseList = ({ useCaseId }: TestCaseListProps) => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    testCases,
    isSubmitting,
    handleEditTestCase,
    handleDeleteTestCase,
  } = useTestCases(useCaseId);

  const [testToEdit, setTestToEdit] = useState<TestCase | null>(null);
  const [testToDelete, setTestToDelete] = useState<TestCase | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(testCases.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTestCases = testCases.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const confirmEdit = async (updatedData: TestCase) => {
    const success = await handleEditTestCase(updatedData);
    if (success) setTestToEdit(null);
  };

  const confirmDelete = async () => {
    if (!testToDelete) return;
    const success = await handleDeleteTestCase(testToDelete.id);
    if (success) {
      setTestToDelete(null);
      if (currentTestCases.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 p-12 text-center animate-pulse">
            <div className="h-10 w-10 rounded-full bg-slate-800 mb-4"></div>
            <div className="h-4 w-48 bg-slate-800 rounded mb-2"></div>
            <div className="h-3 w-32 bg-slate-800 rounded"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-xl border border-red-500/20 bg-red-900/10 p-6 text-center">
          <p className="text-sm font-medium text-red-400 mb-1">Ops! Algo deu errado.</p>
          <p className="text-xs text-red-300/70">{error}</p>
        </div>
      );
    }

    if (testCases.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/50 text-slate-500 mb-4">
            <SearchX size={24} />
          </div>
          <p className="text-slate-400 font-medium">Nenhum caso de teste gerado</p>
          <p className="text-slate-600 text-sm mt-1">Gere novos testes para visualizar aqui.</p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-3">
          {currentTestCases.map((test: TestCase) => (
            <div
              key={test.id}
              className="group relative flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-900/60 hover:shadow-lg hover:shadow-blue-900/5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex w-full items-start gap-4 overflow-hidden">
                {/* Ícone com gradiente sutil */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-blue-400 shadow-inner">
                  <FileText size={18} />
                </div>
                
                <div className="flex flex-col min-w-0 flex-1 gap-1">
                  <span className="font-semibold text-slate-200 truncate block group-hover:text-blue-100 transition-colors">
                    {test.title}
                  </span>
                  
                  {/* Badge para o tipo do teste */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/50 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide text-slate-400">
                        {test.type || "Funcional"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center gap-2 border-t border-slate-800 pt-3 sm:w-auto sm:border-0 sm:pt-0">
                {/* Botão Detalhes */}
                <button
                  onClick={() => navigate(`/test-case/${test.id}`)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-transparent bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-400 sm:flex-none sm:bg-transparent sm:p-2"
                  title="Ver Detalhes"
                >
                  <Eye size={16} />
                  <span className="sm:hidden">Ver</span>
                </button>

                {/* Botão Editar */}
                <button
                  onClick={() => setTestToEdit(test)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-transparent bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400 sm:flex-none sm:bg-transparent sm:p-2"
                  title="Editar"
                >
                  <Edit2 size={16} />
                  <span className="sm:hidden">Editar</span>
                </button>

                {/* Botão Excluir */}
                <button
                  onClick={() => setTestToDelete(test)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-transparent bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 sm:flex-none sm:bg-transparent sm:p-2"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                  <span className="sm:hidden">Excluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {testCases.length > ITEMS_PER_PAGE && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3 sm:flex-row">
            <span className="text-xs text-slate-500 sm:text-sm">
              Mostrando <span className="font-medium text-white">{startIndex + 1}</span> - <span className="font-medium text-white">{Math.min(startIndex + ITEMS_PER_PAGE, testCases.length)}</span> de <span className="font-medium text-white">{testCases.length}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-all hover:border-blue-500/50 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:hover:border-slate-700 disabled:hover:bg-slate-800"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="flex h-8 items-center rounded-lg bg-slate-950/50 px-3 text-sm font-medium text-slate-300">
                {currentPage} <span className="mx-1 text-slate-600">/</span> {totalPages}
              </span>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-all hover:border-blue-500/50 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:hover:border-slate-700 disabled:hover:bg-slate-800"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="mt-10">
      {/* Header da Seção com Ícone */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-500/20">
             <ListChecks size={20} />
        </div>
        <div>
            <h3 className="text-xl font-bold text-white">
            Casos de Teste Gerados
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
                Lista de testes associados a este caso de uso
            </p>
        </div>
      </div>

      {renderContent()}

      <EditTestCaseModal
        isOpen={!!testToEdit}
        onClose={() => setTestToEdit(null)}
        onSubmit={confirmEdit}
        isSubmitting={isSubmitting}
        testCaseToEdit={testToEdit}
      />

      <DeleteConfirmationModal
        isOpen={!!testToDelete}
        onClose={() => setTestToDelete(null)}
        onConfirm={confirmDelete}
        isDeleting={isSubmitting}
        title="Excluir Caso de Teste"
        message={`Tem certeza que deseja excluir o teste "${testToDelete?.title}"?`}
      />
    </section>
  );
};