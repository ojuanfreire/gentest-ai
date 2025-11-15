import React, { useState } from "react";

import { useUseCases } from "../hooks/useUseCases";
import { UseCaseCard } from "../components/UseCaseCard";
import { Button } from "../../../components/common/Button";
import { Plus } from "lucide-react";
import { CreateUseCaseModal } from "../components/CreateUseCaseModal";
import type { UseCaseFormData } from "../components/CreateUseCaseModal";

export const ProjectArtifactsScreen = () => {
  const { loading, error, useCases, isSubmitting, handleCreateUseCase } =
    useUseCases();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = async (data: UseCaseFormData) => {
    const success = await handleCreateUseCase(data);
    if (success) {
      setIsModalOpen(false);
    }
  };

  const renderLoading = () => (
    <div className="mt-10 text-center text-slate-400">
      Carregando casos de uso...
    </div>
  );

  const renderError = () => (
    <div className="mt-10 rounded-md bg-red-900/50 p-4 text-center text-red-300">
      <p>Ocorreu um erro:</p>
      <p className="font-medium">{error}</p>
    </div>
  );

  const renderUseCases = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {useCases.map((useCase) => (
        <UseCaseCard key={useCase.id} useCase={useCase} />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-slate-900 text-white">
      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold text-white">
            Artefatos do Projeto
          </h1>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-200">
              Casos de Uso
            </h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
            >
              <Plus size={20} />
              Novo Caso de Uso
            </Button>
          </div>

          <div className="mt-4">
            {loading && renderLoading()}
            {!loading && error && renderError()}
            {!loading && !error && useCases.length === 0 && (
              <div className="mt-10 text-center text-slate-400">
                Nenhum caso de uso encontrado para este projeto.
              </div>
            )}
            {!loading && !error && useCases.length > 0 && renderUseCases()}
          </div>
        </div>
      </main>

      <CreateUseCaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
