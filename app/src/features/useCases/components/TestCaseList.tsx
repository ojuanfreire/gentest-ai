import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit2,
  Trash,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../../components/common/Button";
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
        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-8 text-center text-sm text-slate-400">
          Carregando casos de teste...
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-5 text-center text-sm text-red-400">
          Erro ao carregar testes: {error}
        </div>
      );
    }

    if (testCases.length === 0) {
      return (
        <div className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-8 text-center text-slate-400">
          Nenhum caso de teste gerado para este Caso de Uso.
        </div>
      );
    }

    return (
      <>
        <div className="space-y-3">
          {currentTestCases.map((test: TestCase) => (
            <div
              key={test.id}
              className="flex flex-col items-start gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex w-full items-center gap-3 overflow-hidden">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-slate-700 text-blue-400">
                  <FileText size={20} />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-medium text-slate-200 truncate block">
                    {test.title}
                  </span>
                  <span className="text-xs text-slate-500">
                    {test.type || "Funcional"}
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
                <button
                  onClick={() => navigate(`/test-case/${test.id}`)}
                  className="flex items-center gap-1.5 rounded bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-slate-700 hover:text-blue-300 transition-colors sm:bg-transparent sm:p-0 sm:text-sm"
                >
                  <Eye size={16} />{" "}
                  <span className="sm:hidden lg:inline">Detalhes</span>
                </button>

                <button
                  onClick={() => setTestToEdit(test)}
                  className="flex items-center gap-1.5 rounded bg-slate-700/50 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-slate-700 hover:text-blue-300 transition-colors sm:bg-transparent sm:p-0 sm:text-sm"
                >
                  <Edit2 size={16} />{" "}
                  <span className="sm:hidden lg:inline">Editar</span>
                </button>

                <button
                  onClick={() => setTestToDelete(test)}
                  className="flex items-center gap-1.5 rounded bg-red-900/20 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-900/40 hover:text-red-400 transition-colors sm:bg-transparent sm:p-0 sm:text-sm"
                >
                  <Trash size={16} />{" "}
                  <span className="sm:hidden lg:inline">Excluir</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {testCases.length > ITEMS_PER_PAGE && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-4 sm:flex-row">
            <span className="text-xs text-slate-400 sm:text-sm">
              Mostrando{" "}
              <span className="font-medium text-white">{startIndex + 1}</span>{" "}
              até{" "}
              <span className="font-medium text-white">
                {Math.min(startIndex + ITEMS_PER_PAGE, testCases.length)}
              </span>{" "}
              de{" "}
              <span className="font-medium text-white">{testCases.length}</span>{" "}
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

              <span className="text-sm font-medium text-white px-2">
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
    );
  };

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Casos de Teste Gerados
        </h3>
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
