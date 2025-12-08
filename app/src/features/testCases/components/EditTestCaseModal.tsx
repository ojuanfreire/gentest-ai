import React, { useState, useEffect } from "react";
import { X, Edit3, Save } from "lucide-react";

import { Button } from "../../../components/common/Button";
import { TextArea } from "../../../components/common/TextArea";
import type { TestCase } from "../../../types";

type EditTestCaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TestCase) => void;
  isSubmitting?: boolean;
  testCaseToEdit: TestCase | null;
};

export const EditTestCaseModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  testCaseToEdit,
}: EditTestCaseModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState("");
  const [expectedResult, setExpectedResult] = useState("");

  useEffect(() => {
    if (isOpen && testCaseToEdit) {
      setTitle(testCaseToEdit.title);
      setDescription(testCaseToEdit.description || "");
      setSteps(testCaseToEdit.steps);
      setExpectedResult(testCaseToEdit.expectedResult);
    } else {
      setTitle("");
      setDescription("");
      setSteps("");
      setExpectedResult("");
    }
  }, [isOpen, testCaseToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testCaseToEdit) return;

    onSubmit({
      ...testCaseToEdit,
      title,
      description,
      steps,
      expectedResult,
    });
  };

  if (!isOpen) return null;

  const inputClasses = "w-full rounded-lg border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none";
  const labelClasses = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      role="dialog"
    >
      <div className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/50 backdrop-blur rounded-t-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Edit3 size={20} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">
                  Editar Caso de Teste
                </h2>
                <p className="text-xs text-slate-500">Refine os passos e validações</p>
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
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <form id="edit-testcase-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Título */}
            <div>
              <label htmlFor="title" className={labelClasses}>
                Título do Teste
              </label>
              <TextArea
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                rows={1}
                placeholder="Ex: Validar login com senha incorreta"
                className={inputClasses}
              />
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
                rows={2}
                placeholder="Contexto adicional sobre o teste..."
                className={inputClasses}
              />
            </div>

            {/* Grid Passos vs Resultado */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              
              {/* Coluna Passos */}
              <div>
                <label htmlFor="steps" className={`${labelClasses} text-blue-400`}>
                  Passos de Execução
                </label>
                <TextArea
                  id="steps"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  rows={8}
                  required
                  placeholder="1. Acessar tela..."
                  className={`${inputClasses} border-blue-900/30 bg-blue-950/20 focus:border-blue-500`}
                />
              </div>

              {/* Coluna Resultado */}
              <div>
                <label htmlFor="expectedResult" className={`${labelClasses} text-emerald-500`}>
                  Resultado Esperado
                </label>
                <TextArea
                  id="expectedResult"
                  value={expectedResult}
                  onChange={(e) => setExpectedResult(e.target.value)}
                  rows={8}
                  required
                  placeholder="O sistema deve exibir..."
                  className={`${inputClasses} border-emerald-900/30 bg-emerald-950/20 focus:border-emerald-500 focus:ring-emerald-500`}
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
            form="edit-testcase-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 border-none"
          >
            <Save size={18} />
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>
    </div>
  );
};