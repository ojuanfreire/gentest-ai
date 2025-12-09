import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Wand2,
  Code2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Clock,
  CheckCircle2,
  ListOrdered,
} from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="flex min-h-screen w-full flex-col bg-slate-950 p-6 lg:p-10">
        <div className="mx-auto w-full max-w-5xl space-y-6 animate-pulse">
          <div className="h-8 w-1/3 bg-slate-800 rounded-lg"></div>
          <div className="h-64 w-full bg-slate-800/50 rounded-2xl"></div>
          <div className="h-32 w-full bg-slate-800/50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !testCase) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-red-500/20 bg-red-900/10 p-8 text-center backdrop-blur-sm">
          <h2 className="mb-2 text-xl font-bold">
            Caso de Teste não encontrado
          </h2>
          <Button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-lg bg-slate-800 px-6 py-2 text-white hover:bg-slate-700"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Função para formatar os passos caso venham como array JSON
  const renderFormattedText = (text: string | undefined) => {
    if (!text) return null;

    try {
      const parsed = JSON.parse(text);

      if (Array.isArray(parsed)) {
        return (
          <ul className="flex flex-col gap-2 list-none">
            {parsed.map((item, index) => (
              <li key={index} className="text-slate-300 break-words">
                {item}
              </li>
            ))}
          </ul>
        );
      }
    } catch (e) {
      return text;
    }

    return text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex min-h-screen w-full flex-col bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.15),rgba(255,255,255,0))] text-white"
    >
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto max-w-5xl px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={() => navigate(-1)}
            className="group flex w-fit items-center gap-2 bg-transparent pl-0 text-slate-400 hover:bg-transparent hover:text-white border-none"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Voltar ao Caso de Uso
          </Button>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 font-medium text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
            >
              <Trash2 size={18} />{" "}
              <span className="sm:hidden lg:inline">Excluir</span>
            </Button>

            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600/10 px-4 py-2 font-medium text-blue-400 hover:bg-blue-600/20 transition-colors border border-blue-500/20"
            >
              <Edit2 size={18} />{" "}
              <span className="sm:hidden lg:inline">Editar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-8 lg:p-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              ID {testCase.id}
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400 border border-slate-700">
              {testCase.type || "Funcional"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight">
            {testCase.title}
          </h1>
        </div>

        <div className="grid gap-8 grid-cols-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-1 shadow-lg backdrop-blur-sm">
            <div className="rounded-xl bg-slate-900/60 p-6 sm:p-8">
              {/* Descrição */}
              <div className="mb-8 group">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                  Descrição do Cenário
                </h3>
                <div className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-5 text-slate-300 leading-relaxed shadow-inner group-hover:border-slate-700 transition-colors">
                  {testCase.description || (
                    <span className="italic text-slate-600">
                      Sem descrição definida.
                    </span>
                  )}
                </div>
              </div>

              {/* Grid Passos vs Resultado */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col h-full group">
                  <h4 className="mb-3 text-xs font-bold uppercase text-slate-400 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    <ListOrdered size={16} /> Passos de Execução
                  </h4>
                  <div className="flex-1 rounded-lg border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner group-hover:border-slate-700 transition-colors">
                    {renderFormattedText(testCase.steps)}
                  </div>
                </div>

                <div className="flex flex-col h-full group">
                  <h4 className="mb-3 text-xs font-bold uppercase text-slate-400 flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                    <CheckCircle2 size={16} /> Resultado Esperado
                  </h4>
                  <div className="flex-1 rounded-lg border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner group-hover:border-slate-700 transition-colors">
                    {testCase.expectedResult}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <Terminal size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">
                Automação e Código
              </h3>
            </div>

            {/* Gerador */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 flex flex-col lg:flex-row gap-6 items-end">
              <div className="flex-1 w-full">
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Framework de Teste
                </label>
                <div className="relative">
                  <select
                    value={selectedFramework}
                    onChange={(e) =>
                      setSelectedFramework(e.target.value as SkeletonFramework)
                    }
                    className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 p-4 text-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all cursor-pointer hover:border-slate-600"
                  >
                    <option value="JavaScript + Cypress">
                      JavaScript + Cypress
                    </option>
                    <option value="Python + Playwright">
                      Python + Playwright
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <Code2 size={16} />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerateClick}
                disabled={isSubmitting}
                className="w-full lg:w-auto flex h-[58px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 font-bold text-white shadow-lg shadow-violet-500/20 hover:scale-[1.02] hover:shadow-violet-500/40 transition-all border-none"
              >
                <Wand2 size={20} />
                {isSubmitting ? "Gerando Código..." : "Gerar Esqueleto"}
              </Button>
            </div>

            {/* Lista de Skeletons */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pl-1">
                Histórico de Gerações ({skeletons.length})
              </h4>

              {skeletons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/30">
                  <Code2 size={40} className="text-slate-700 mb-3" />
                  <p className="text-slate-500">Nenhum código gerado ainda.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentSkeletons.map((sk) => (
                    <div
                      key={sk.id}
                      className="group flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-violet-500/30 hover:bg-slate-900 hover:shadow-lg hover:shadow-violet-900/10 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-slate-400 group-hover:bg-violet-500/10 group-hover:text-violet-400 transition-colors">
                          <Code2 size={24} />
                        </div>
                        <div>
                          <span className="block font-semibold text-slate-200 group-hover:text-violet-200 transition-colors">
                            {sk.framework}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Clock size={12} />
                            {new Date(
                              sk.createdAt
                            ).toLocaleDateString()} às{" "}
                            {new Date(sk.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t border-slate-800 pt-3 sm:border-0 sm:pt-0">
                        <button
                          onClick={() => handleViewSkeleton(sk.id)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-violet-600 hover:border-violet-500 hover:text-white sm:flex-none"
                        >
                          <Eye size={16} />
                          Ver Código
                        </button>
                        <button
                          onClick={() => handleDeleteSkeletonClick(sk.id)}
                          className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 p-2 text-slate-400 transition-all hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400"
                          title="Excluir código"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {skeletons.length > ITEMS_PER_PAGE && (
                <div className="mt-6 flex items-center justify-center gap-4 rounded-xl border border-slate-800 bg-slate-900/30 p-3">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-medium text-slate-400">
                    Página <span className="text-white">{currentPage}</span> de{" "}
                    {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isSubmitting}
        title="Excluir Caso de Teste"
        message={`Tem certeza que deseja excluir "${testCase.title}"? Todos os códigos gerados também serão perdidos.`}
      />

      <EditTestCaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleConfirmEdit}
        isSubmitting={isSubmitting}
        testCaseToEdit={testCase}
      />
    </motion.div>
  );
};
