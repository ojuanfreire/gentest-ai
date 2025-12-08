import React, { useState, useEffect } from "react";
import { Button } from "../../../components/common/Button";
import { TextArea } from "../../../components/common/TextArea";
import { X, Save, Edit3 } from "lucide-react";
import type { UseCase } from "../../../types/index";

export type UseCaseEditFormData = Omit<
  UseCase,
  "id" | "projectId" | "createdAt"
>;

type EditUseCaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UseCase) => void;
  isSubmitting?: boolean;
  useCaseToEdit: UseCase | null;
};

export const EditUseCaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  useCaseToEdit,
}: EditUseCaseModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [actor, setActor] = useState("");
  const [preconditions, setPreconditions] = useState("");
  const [mainFlow, setMainFlow] = useState("");
  const [alternativeFlows, setAlternativeFlows] = useState("");

  useEffect(() => {
    if (isOpen && useCaseToEdit) {
      setName(useCaseToEdit.name);
      setDescription(useCaseToEdit.description);
      setActor(useCaseToEdit.actor);
      setPreconditions(useCaseToEdit.preconditions);
      setMainFlow(useCaseToEdit.mainFlow);
      setAlternativeFlows(useCaseToEdit.alternativeFlows);
    } else if (!isOpen) {
      setName("");
      setDescription("");
      setActor("");
      setPreconditions("");
      setMainFlow("");
      setAlternativeFlows("");
    }
  }, [isOpen, useCaseToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!useCaseToEdit) return;

    const updatedUseCase: UseCase = {
      ...useCaseToEdit,
      name,
      description,
      actor,
      preconditions,
      mainFlow,
      alternativeFlows,
    };
    onSubmit(updatedUseCase);
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
      {/* Container do Modal com Borda Sutil e Sombra Profunda */}
      <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header Fixo */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Edit3 size={20} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">
                Editar Caso de Uso
                </h2>
                <p className="text-xs text-slate-500">Atualize as informações do artefato</p>
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

        {/* Corpo do Formulário Scrollável */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="edit-name" className={labelClasses}>
                  Nome do Caso de Uso
                </label>
                <TextArea
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Efetuar Login"
                  required
                  rows={1}
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="edit-actor" className={labelClasses}>
                  Ator Principal
                </label>
                <TextArea
                  id="edit-actor"
                  value={actor}
                  onChange={(e) => setActor(e.target.value)}
                  placeholder="Ex: Cliente"
                  required
                  rows={1}
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-description" className={labelClasses}>
                Descrição
              </label>
              <TextArea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo deste caso de uso..."
                rows={3}
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="edit-preconditions" className={labelClasses}>
                Pré-Condições
              </label>
              <TextArea
                id="edit-preconditions"
                value={preconditions}
                onChange={(e) => setPreconditions(e.target.value)}
                placeholder="- O usuário deve estar logado..."
                rows={3}
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="edit-mainFlow" className={`${labelClasses} text-blue-400`}>
                  Fluxo Principal
                </label>
                <div className="relative">
                    <TextArea
                    id="edit-mainFlow"
                    value={mainFlow}
                    onChange={(e) => setMainFlow(e.target.value)}
                    placeholder="1. O usuário acessa..."
                    rows={8}
                    required
                    className={`${inputClasses} border-blue-900/30 bg-blue-950/20 focus:border-blue-500`}
                    />
                </div>
              </div>
              <div>
                <label htmlFor="edit-alternativeFlows" className={`${labelClasses} text-amber-500`}>
                  Fluxos Alternativos
                </label>
                <TextArea
                  id="edit-alternativeFlows"
                  value={alternativeFlows}
                  onChange={(e) => setAlternativeFlows(e.target.value)}
                  placeholder="1a. Se a senha for inválida..."
                  rows={8}
                  className={`${inputClasses} border-amber-900/30 bg-amber-950/10 focus:border-amber-500 focus:ring-amber-500`}
                />
              </div>
            </div>
          </div>

          {/* Footer com Ações */}
          <div className="mt-8 flex justify-end gap-3 border-t border-slate-800 pt-5">
            <Button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-transparent px-4 py-2 font-semibold text-slate-300 transition-colors hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 border-none"
            >
              <Save size={18} />
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};