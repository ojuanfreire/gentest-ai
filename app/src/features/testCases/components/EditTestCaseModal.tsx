import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

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

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
      role="dialog"
    >
      <div className="w-full max-w-2xl rounded-lg bg-slate-800 p-6 shadow-xl border border-slate-700 max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Editar Caso de Teste
            </h2>
            <Button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 bg-transparent text-slate-400 hover:bg-slate-700 hover:text-white border-none"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Título
              </label>
              <TextArea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                rows={1}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">
                Descrição
              </label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Passos
                </label>
                <TextArea
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  rows={6}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">
                  Resultado Esperado
                </label>
                <TextArea
                  value={expectedResult}
                  onChange={(e) => setExpectedResult(e.target.value)}
                  rows={6}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="rounded-md bg-slate-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-slate-600 border-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 border-none"
            >
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
