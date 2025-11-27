import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Copy, Check, ChevronDown } from "lucide-react";

import { useCodeSkeleton } from "../hooks/useCodeSkeleton";
import { Button } from "../../../components/common/Button";
import { DeleteConfirmationModal } from "../../../components/common/DeleteConfirmationModal";

export const CodeSkeletonScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading, error, skeleton, isSubmitting, deleteSkeleton } =
    useCodeSkeleton(id);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleDeleteConfirm = async () => {
    const success = await deleteSkeleton();
    if (success) {
      setIsDeleteModalOpen(false);
      navigate(-1);
    }
  };

  const handleCopyCode = () => {
    if (skeleton?.code) {
      navigator.clipboard.writeText(skeleton.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        Carregando esqueleto...
      </div>
    );
  }

  if (error || !skeleton) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 text-white">
        <h2 className="mb-4 text-xl font-bold">Esqueleto não encontrado</h2>
        <Button
          onClick={() => navigate(-1)}
          className="bg-slate-700 text-white hover:bg-slate-600"
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white">
      {/* --- Header da Página --- */}
      <header className="border-b border-slate-700 bg-slate-800/50 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-transparent pl-0 text-slate-400 hover:bg-transparent hover:text-white"
          >
            <ArrowLeft size={20} />
            Voltar
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-6 lg:p-10">
        <h1 className="mb-8 text-center text-3xl font-bold text-white">
          Esqueleto de Código
        </h1>

        <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium text-slate-200">
              Esqueleto Gerado
            </h2>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors border-none shadow-sm"
            >
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </Button>
          </div>

          <div className="overflow-hidden rounded-md border border-slate-600 bg-slate-900 shadow-inner">
            <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700">
              <div className="flex items-center gap-2 rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-slate-200 select-none">
                <span className="font-medium text-slate-400">Framework:</span>
                <span>{skeleton.framework}</span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check size={16} /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={16} /> Copiar código
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={skeleton.code}
                className="h-[500px] w-full resize-none bg-slate-900 p-4 font-mono text-sm text-slate-300 focus:outline-none selection:bg-blue-500/30 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSubmitting}
        title="Excluir Esqueleto"
        message="Tem certeza que deseja excluir este esqueleto de código? Esta ação não pode ser desfeita."
      />
    </div>
  );
};
