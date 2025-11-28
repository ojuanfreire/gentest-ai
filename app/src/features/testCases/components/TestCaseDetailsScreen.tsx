import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Wand2,
  Code,
  Eye,
  Trash,
} from "lucide-react";

import { useTestCaseDetails } from "../hooks/useTestCaseDetails";
import { Button } from "../../../components/common/Button";
import { DeleteConfirmationModal } from "../../../components/common/DeleteConfirmationModal";
import { EditTestCaseModal } from "../components/EditTestCaseModal";
import type { SkeletonFramework, TestCase } from "../../../types";
import { Header } from "../../../components/common/Header";

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
    console.log("Visualizar esqueleto:", skeletonId);
    alert("Funcionalidade de visualizar código a implementar.");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        Carregando caso de teste...
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
    <div className="min-h-screen w-full bg-slate-900 text-white">
      <Header />

      <header className="border-b border-slate-700 bg-slate-800/50 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-transparent pl-0 text-slate-400 hover:bg-transparent hover:text-white"
          >
            <ArrowLeft size={20} />
            Voltar ao Caso de Uso
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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{testCase.title}</h1>
          </div>
          <p className="mt-2 text-sm text-slate-400">ID: {testCase.id}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-1">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Informações do Caso de Teste
            </h3>

            <div className="min-h-[80px] w-full rounded-md border border-slate-600 bg-slate-900/50 p-4 text-slate-200 whitespace-pre-wrap">
              {testCase.description || "Sem descrição."}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                  Passos
                </h4>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300 whitespace-pre-wrap">
                  {testCase.steps}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-500">
                  Resultado Esperado
                </h4>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-4 text-sm text-slate-300 whitespace-pre-wrap">
                  {testCase.expectedResult}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">
              Esqueleto de Código
            </h3>

            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-6">
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
                  className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm border-none whitespace-nowrap h-[42px]"
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
              <div className="rounded-lg border border-dashed border-slate-700 bg-slate-800/30 p-8 text-center text-slate-400">
                Nenhum esqueleto gerado para este caso de teste ainda.
              </div>
            ) : (
              <div className="space-y-3">
                {skeletons.map((sk) => (
                  <div
                    key={sk.id}
                    className="flex flex-col items-start justify-between gap-4 rounded-lg border border-slate-700 bg-slate-800 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-slate-700 text-blue-400">
                        <Code size={20} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-slate-200 truncate">
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

                    <div className="flex w-full justify-end gap-3 sm:w-auto">
                      <button
                        onClick={() => handleViewSkeleton(sk.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                      >
                        <Eye size={16} /> Visualizar Detalhes
                      </button>
                      <button
                        onClick={() => handleDeleteSkeleton(sk.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-400 hover:underline transition-colors ml-2"
                      >
                        <Trash size={16} /> Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
