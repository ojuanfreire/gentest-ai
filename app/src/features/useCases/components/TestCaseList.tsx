import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2 } from "lucide-react";
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
        <div className="p-5 text-center text-sm text-slate-400">
          Carregando casos de teste...
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-5 text-center text-sm text-red-400">
          Erro ao carregar testes: {error}
        </div>
      );
    }

    if (testCases.length === 0) {
      return (
        <div className="p-5 text-center text-sm text-slate-400">
          Nenhum caso de teste gerado para este Caso de Uso.
        </div>
      );
    }

    return (
      <div className="divide-y divide-slate-700/50">
        {testCases.map((test: TestCase) => (
          <div
            key={test.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 transition-colors hover:bg-slate-700/50 gap-4"
          >
            <div className="flex-1">
              <span className="text-xs font-semibold uppercase text-blue-400">
                {test.type}
              </span>
              <h4 className="font-bold text-slate-200 text-md mt-1">
                {test.title}
              </h4>
              <p className="font-medium text-slate-400 text-sm mt-1 line-clamp-2">
                {test.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-full text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                title="Visualizar Detalhes"
                onClick={() => navigate(`/test-case/${test.id}`)} 
              >
                <Eye size={18} />
              </button>

              <button
                className="p-2 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                title="Editar Caso de Teste"
                onClick={() => setTestToEdit(test)}
              >
                <Edit2 size={18} />
              </button>

              <button
                className="p-2 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Excluir Caso de Teste"
                onClick={() => setTestToDelete(test)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Casos de Teste Gerados
        </h3>
      </div>
      <div className="overflow-hidden rounded-md border border-slate-700 bg-slate-800 text-slate-200">
        {renderContent()}
      </div>

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
        message={`Tem certeza que deseja excluir o teste ${testToDelete?.title}?`}
      />
    </section>
  );
};
