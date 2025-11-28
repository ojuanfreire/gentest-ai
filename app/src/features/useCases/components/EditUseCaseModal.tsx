import React, { useState, useEffect } from "react";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/common/Input";
import { TextArea } from "../../../components/common/TextArea";
import { X } from "lucide-react";
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-75 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-2xl rounded-lg bg-slate-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Editar Caso de Uso
            </h2>
            <Button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-title"
                  className="mb-1 block text-sm font-medium text-slate-300"
                >
                  Nome
                </label>
                <TextArea
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Exemplo de nome"
                  required
                  rows={1}
                />
              </div>
              <div>
                <label
                  htmlFor="edit-actor"
                  className="mb-1 block text-sm font-medium text-slate-300"
                >
                  Ator
                </label>
                <TextArea
                  id="edit-actor"
                  value={actor}
                  onChange={(e) => setActor(e.target.value)}
                  placeholder="Ex: Cliente"
                  required
                  rows={1}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-description"
                className="mb-1 block text-sm font-medium text-slate-300"
              >
                Descrição
              </label>
              <TextArea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o caso de uso..."
                rows={2}
              />
            </div>

            <div>
              <label
                htmlFor="edit-preconditions"
                className="mb-1 block text-sm font-medium text-slate-300"
              >
                Pré Condições
              </label>
              <TextArea
                id="edit-preconditions"
                value={preconditions}
                onChange={(e) => setPreconditions(e.target.value)}
                placeholder="Ex: X&#10;Y&#10;Z"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-mainFlow"
                  className="mb-1 block text-sm font-medium text-slate-300"
                >
                  Fluxo Principal
                </label>
                <TextArea
                  id="edit-mainFlow"
                  value={mainFlow}
                  onChange={(e) => setMainFlow(e.target.value)}
                  placeholder="Ex: X&#10;Y&#10;Z"
                  rows={8}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="edit-alternativeFlows"
                  className="mb-1 block text-sm font-medium text-slate-300"
                >
                  Fluxos Alternativos
                </label>
                <TextArea
                  id="edit-alternativeFlows"
                  value={alternativeFlows}
                  onChange={(e) => setAlternativeFlows(e.target.value)}
                  placeholder="Ex: X&#10;Y&#10;Z"
                  rows={8}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              onClick={onClose}
              className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Salvando..." : "Editar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
