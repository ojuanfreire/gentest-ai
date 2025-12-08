import React, { useState, useEffect } from "react";
import { Button } from "../../../components/common/Button";
import { TextArea } from "../../../components/common/TextArea";
import { X, FilePlus, Save } from "lucide-react";
import type { UseCase } from "../../../types/index";

export type UseCaseFormData = Omit<UseCase, "id" | "projectId" | "createdAt">;

type CreateUseCaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UseCaseFormData) => void;
  isSubmitting?: boolean;
};

export const CreateUseCaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateUseCaseModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [actor, setActor] = useState("");
  const [preconditions, setPreconditions] = useState("");
  const [mainFlow, setMainFlow] = useState("");
  const [alternativeFlows, setAlternativeFlows] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setActor("");
      setPreconditions("");
      setMainFlow("");
      setAlternativeFlows("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      actor,
      preconditions,
      mainFlow,
      alternativeFlows,
    });
  };

  if (!isOpen) {
    return null;
  }

  const inputClasses = "w-full rounded-lg border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none";
  const labelClasses = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Container Principal do Modal */}
      <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50 flex flex-col max-h-[90vh]">
        
        {/* Header Fixo */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/50 backdrop-blur rounded-t-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <FilePlus size={20} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">Novo Caso de Uso</h2>
                <p className="text-xs text-slate-500">Defina os detalhes para gerar testes</p>
            </div>
          </div>
          <Button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border-none"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Corpo Scrollável */}
        <div className="overflow-y-auto p-6 custom-scrollbar">
          <form id="create-usecase-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Nome e Ator */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="title" className={labelClasses}>
                  Nome do Caso de Uso
                </label>
                <TextArea
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Efetuar Login"
                  required
                  rows={1}
                  className={inputClasses}
                />
              </div>

              <div>
                <label htmlFor="actor" className={labelClasses}>
                  Ator Principal
                </label>
                <TextArea
                  id="actor"
                  value={actor}
                  onChange={(e) => setActor(e.target.value)}
                  placeholder="Ex: Usuário não autenticado"
                  required
                  rows={1}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className={labelClasses}>
                Descrição
              </label>
              <TextArea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo e o contexto..."
                rows={3}
                className={inputClasses}
              />
            </div>

            {/* Pré-condições */}
            <div>
              <label htmlFor="preconditions" className={labelClasses}>
                Pré-Condições
              </label>
              <TextArea
                id="preconditions"
                value={preconditions}
                onChange={(e) => setPreconditions(e.target.value)}
                placeholder="Ex: O usuário deve estar na página inicial..."
                rows={3}
                className={inputClasses}
              />
            </div>

            {/* Fluxos */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              
              {/* Fluxo Principal */}
              <div>
                <label htmlFor="mainFlow" className={`${labelClasses} text-blue-400`}>
                  Fluxo Principal
                </label>
                <TextArea
                  id="mainFlow"
                  value={mainFlow}
                  onChange={(e) => setMainFlow(e.target.value)}
                  placeholder="1. O usuário informa..."
                  rows={8}
                  required
                  className={`${inputClasses} border-blue-900/30 bg-blue-950/20 focus:border-blue-500`}
                />
              </div>

              {/* Fluxos Alternativos */}
              <div>
                <label htmlFor="alternativeFlows" className={`${labelClasses} text-amber-500`}>
                  Fluxos Alternativos
                </label>
                <TextArea
                  id="alternativeFlows"
                  value={alternativeFlows}
                  onChange={(e) => setAlternativeFlows(e.target.value)}
                  placeholder="1a. Se a senha for inválida..."
                  rows={8}
                  className={`${inputClasses} border-amber-900/30 bg-amber-950/10 focus:border-amber-500 focus:ring-amber-500`}
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-6 bg-slate-900/30 rounded-b-xl flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-transparent px-4 py-2 font-semibold text-slate-300 transition-colors hover:bg-slate-800"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="create-usecase-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 border-none"
          >
            <Save size={18} />
            {isSubmitting ? "Gerando..." : "Criar Caso de Uso"}
          </Button>
        </div>
      </div>
    </div>
  );
};