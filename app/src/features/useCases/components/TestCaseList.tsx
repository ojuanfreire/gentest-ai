import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash, FileText } from "lucide-react";
import { Button } from "../../../components/common/Button";
import { useTestCases } from "../hooks/useTestCases";
import { EditTestCaseModal } from "../../testCases/components/EditTestCaseModal";
import { DeleteConfirmationModal } from "../../../components/common/DeleteConfirmationModal";
import type { TestCase } from "../../../types";

type TestCaseListProps = {
  useCaseId: string | number;
};

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

  const confirmEdit = async (updatedData: TestCase) => {
    const success = await handleEditTestCase(updatedData);
    if (success) setTestToEdit(null);
  };

  const confirmDelete = async () => {
    if (!testToDelete) return;
    const success = await handleDeleteTestCase(testToDelete.id);
    if (success) setTestToDelete(null);
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
      <div className="space-y-3">
        {testCases.map((test: TestCase) => (
          <div
            key={test.id}
            className="flex flex-col items-start justify-between gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-slate-700 text-blue-400">
                <FileText size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-slate-200 truncate">
                  {test.title}
                </span>
                <span className="text-xs text-slate-500">
                  {test.type || "Funcional"}
                </span>
              </div>
            </div>

            <div className="flex w-full justify-end gap-3 sm:w-auto">
              <button
                onClick={() => navigate(`/test-case/${test.id}`)}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                <Eye size={16} /> Visualizar Detalhes
              </button>

              <button
                onClick={() => setTestToEdit(test)}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors ml-2"
              >
                <Edit2 size={16} /> Editar
              </button>

              <button
                onClick={() => setTestToDelete(test)}
                className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-400 hover:underline transition-colors ml-2"
              >
                <Trash size={16} /> Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
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
