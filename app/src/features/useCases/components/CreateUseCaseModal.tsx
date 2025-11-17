import React, { useState, useEffect } from "react";

import { Button } from "../../../components/common/Button.tsx";
import { Input } from "../../../components/common/Input.tsx";
import { TextArea } from "../../../components/common/TextArea.tsx";
import { X } from "lucide-react";
import type { UseCase } from "../../../types/index.ts";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actor, setActor] = useState("");
  const [preconditions, setPreconditions] = useState("");
  const [mainFlow, setMainFlow] = useState("");
  const [alternativeFlows, setAlternativeFlows] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
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
      title,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-75 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-2xl rounded-lg bg-slate-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Criar Caso de Uso</h2>
            <Button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-slate-300"
                >
                  Nome (Título)
                </label>
                <TextArea
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Efetuar Login"
                  required
                  rows={1}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-slate-300"
                >
                  Descrição
                </label>
                <TextArea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Descreve o processo de login do usuário..."
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="preconditions"
                  className="mb-1 block text-sm font-medium text-slate-300"
                >
                  Pré Condições
                </label>
                <TextArea
                  id="preconditions"
                  value={preconditions}
                  onChange={(e) => setPreconditions(e.target.value)}
                  placeholder="Ex: O usuário deve estar na página de login."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="actor"
                  className="mb-1 block text-sm font-medium text-slate-300"
                >
                  Ator
                </label>
                <TextArea
                  id="actor"
                  value={actor}
                  onChange={(e) => setActor(e.target.value)}
                  placeholder="Ex: Usuário não autenticado"
                  required
                  rows={1}
                />
              </div>
              <div>
                <label
                  htmlFor="alternativeFlows"
                  className="mb-1 block text-sm font-medium text-slate-300"
                >
                  Fluxos Alternativos
                </label>
                <TextArea
                  id="alternativeFlows"
                  value={alternativeFlows}
                  onChange={(e) => setAlternativeFlows(e.target.value)}
                  placeholder="Ex: 1. O usuário digita a senha errada..."
                  rows={10}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="mainFlow"
                className="mb-1 block text-sm font-medium text-slate-300"
              >
                Fluxo Principal
              </label>
              <TextArea
                id="mainFlow"
                value={mainFlow}
                onChange={(e) => setMainFlow(e.target.value)}
                placeholder="Ex:
  1. O usuário informa o e-mail 
  2. O usuário informa a senha 
  3. O usuário clica no botão 'Entrar'"
                rows={8}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              onClick={onClose}
              className="rounded-md bg-slate-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Gerando..." : "Gerar Casos de Teste"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
