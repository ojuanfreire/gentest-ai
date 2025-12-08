import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, Terminal, Trash2, Code2 } from "lucide-react";

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
    if (skeleton?.generatedCode) {
      navigator.clipboard.writeText(skeleton.generatedCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (loading) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-slate-950 p-6 lg:p-10">
           <div className="mx-auto w-full max-w-5xl space-y-6 animate-pulse">
              <div className="h-8 w-1/4 bg-slate-800 rounded-lg"></div>
              <div className="h-[600px] w-full bg-slate-800/50 rounded-2xl border border-slate-800"></div>
           </div>
        </div>
      );
  }

  if (error || !skeleton) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <div className="rounded-2xl border border-red-500/20 bg-red-900/10 p-10 text-center backdrop-blur-sm">
            <h2 className="mb-2 text-xl font-bold">Esqueleto não encontrado</h2>
            <p className="text-red-300/70 mb-6">O código que você procura não existe ou foi removido.</p>
            <Button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-slate-800 px-6 py-2 text-white hover:bg-slate-700 border border-slate-700"
            >
            Voltar
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            className="group flex w-fit items-center gap-2 bg-transparent pl-0 text-slate-400 hover:bg-transparent hover:text-white border-none transition-colors"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar
          </Button>
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
          >
            <Trash2 size={16} /> Excluir
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl p-6 lg:p-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-300">
                        <Terminal size={12} />
                        Gerado via IA
                    </span>
                    <span className="text-xs text-slate-500">
                        {new Date(skeleton.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-white">
                Esqueleto de Código
                </h1>
            </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-700 bg-[#0d1117] shadow-2xl shadow-black/50 ring-1 ring-white/5">
          
          {/* Barra de Título do Editor */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
               <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
               </div>
               
               {/* Nome do Arquivo / Framework */}
               <div className="ml-4 flex items-center gap-2 text-sm font-medium text-slate-400">
                  <Code2 size={16} className="text-blue-400" />
                  <span>{skeleton.framework.replace(' + ', '_').toLowerCase()}</span>
               </div>
            </div>

            {/* Botão de Copiar */}
            <button
              onClick={handleCopyCode}
              className={`group flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                isCopied 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
              }`}
            >
              {isCopied ? (
                <>
                  <Check size={14} /> COPIADO!
                </>
              ) : (
                <>
                  <Copy size={14} className="group-hover:scale-110 transition-transform" /> COPIAR CÓDIGO
                </>
              )}
            </button>
          </div>

          {/* Área de Código */}
          <div className="relative group">
            <textarea
              readOnly
              value={skeleton.generatedCode}
              className="h-[600px] w-full resize-none bg-[#0d1117] p-6 font-mono text-sm leading-relaxed text-slate-300 focus:outline-none selection:bg-blue-500/30 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent custom-editor-font"
              spellCheck={false}
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5 rounded-b-xl"></div>
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