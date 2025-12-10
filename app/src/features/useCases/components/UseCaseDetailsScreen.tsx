import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Layers,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

import { useUseCases } from "../hooks/useUseCases";
import { useCaseService } from "../services/useCaseService";
import { aiGenerationService } from "../../ai/services/aiGenerationService";
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

  // Estado para simular geração
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateTestCases = async () => {
    if (!useCase) return;
    setIsGenerating(true);
    try {
      await useCaseService.deleteTestCasesByUseCaseId(useCase.id);
      
      const generatedTests = await aiGenerationService.generateTestCases(useCase);
      
      await useCaseService.createTestCases(generatedTests, useCase.id);
    } catch (error) {
      console.error("Erro ao gerar casos de teste:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
          <p className="text-slate-400 animate-pulse">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (!useCase) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <h2 className="mb-4 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
          Caso de Uso não encontrado
        </h2>
        <Button
          onClick={() => navigate(-1)}
          className="rounded-md bg-slate-800 border border-slate-700 px-4 py-2 text-white hover:bg-slate-700"
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex min-h-screen w-full flex-col bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] text-white"
    >
      <header className="top-0 z-10 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-5xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 bg-transparent pl-0 text-slate-400 hover:bg-transparent hover:text-white border-none w-fit transition-colors"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Voltar aos Artefatos
          </Button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none justify-center flex items-center gap-2 rounded-lg bg-gradient-to-b from-red-500/10 to-red-600/10 border border-red-500/20 px-4 py-2 font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all shadow-sm"
            >
              <Trash2 size={18} /> Excluir
            </Button>

            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600/10 px-4 py-2 font-medium text-blue-400 hover:bg-blue-600/20 transition-colors border border-blue-500/20"
            >
              <Edit2 size={18} /> Editar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-8 lg:p-10">
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-50 to-slate-400 break-words drop-shadow-sm">
              {useCase.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
                ID: {useCase.id}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-1 sm:p-1 shadow-2xl">
            <div className="rounded-lg bg-slate-900/40 p-5 sm:p-8 backdrop-blur-sm">
              <div className="group">
                <div className="flex items-center gap-2 mb-6">
                  <Layers size={20} className="text-blue-500" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-400 transition-colors">
                    Detalhes do Caso de Uso
                  </h3>
                </div>

                <div className="min-h-[80px] w-full rounded-lg border border-slate-700/50 bg-slate-950/50 p-5 text-slate-300 whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed shadow-inner group-hover:border-slate-600 transition-colors">
                  {useCase.description || (
                    <span className="text-slate-600 italic">
                      Sem descrição disponível.
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="group">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-blue-400/70" />
                    <h4 className="text-xs font-bold uppercase text-slate-500 group-hover:text-blue-400 transition-colors">
                      Ator Principal
                    </h4>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-300 font-medium group-hover:border-slate-700 transition-colors">
                    {useCase.actor}
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-blue-400/70" />
                    <h4 className="text-xs font-bold uppercase text-slate-500 group-hover:text-blue-400 transition-colors">
                      Criado em
                    </h4>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-300 font-medium group-hover:border-slate-700 transition-colors">
                    {new Date(
                      useCase.createdAt || Date.now()
                    ).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>

              <div className="mt-8 group">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-blue-400/70" />
                  <h4 className="text-xs font-bold uppercase text-slate-500 group-hover:text-blue-400 transition-colors">
                    Pré-condições
                  </h4>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/30 p-4 text-sm text-slate-300 whitespace-pre-wrap break-words group-hover:border-slate-700 transition-colors">
                  {useCase.preconditions || "Nenhuma pré-condição definida."}
                </div>
              </div>

              <div className="mt-8 mb-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col h-full group">
                  <h4 className="mb-3 text-xs font-bold uppercase text-slate-400 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                    Fluxo Principal
                  </h4>
                  <div className="flex-1 rounded-lg border border-slate-800 bg-slate-950/10 p-5 text-sm text-slate-300 whitespace-pre-wrap break-words group-hover:border-slate-700 transition-colors">
                    {useCase.mainFlow}
                  </div>
                </div>

                <div className="flex flex-col h-full group">
                  <h4 className="mb-3 text-xs font-bold uppercase text-slate-400 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                    Fluxos Alternativos
                  </h4>
                  <div className="flex-1 rounded-lg border border-slate-800 bg-slate-950/30 p-5 text-sm text-slate-300 whitespace-pre-wrap break-words group-hover:border-slate-700 transition-colors">
                    {useCase.alternativeFlows || "Nenhum fluxo alternativo."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section>
            <TestCaseList
              useCaseId={useCase.id}
              onGenerate={handleGenerateTestCases}
              isGenerating={isGenerating}
            />
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
    </motion.div>
  );
};
