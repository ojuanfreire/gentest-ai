import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import { Button } from "../../../components/common/Button";
import { TextArea } from "../../../components/common/TextArea";
import type { Project } from "../../../types/index";

export type ProjectFormData = Pick<Project, "name" | "description">;

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  isSubmitting?: boolean;
};

export const CreateProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
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
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-6 shadow-xl border border-slate-700">
        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Novo Projeto</h2>
            <Button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 bg-transparent text-slate-400 hover:bg-slate-700 hover:text-white border-none"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="project-name"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Nome do Projeto
              </label>
              <TextArea
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sistema de Gestão Financeira"
                required
                autoFocus
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                rows={1}
              />
            </div>

            <div>
              <label
                htmlFor="project-description"
                className="mb-1.5 block text-sm font-medium text-slate-300"
              >
                Descrição
              </label>
              <TextArea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo do projeto..."
                rows={4}
                className="bg-slate-900 border-slate-600 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
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
              className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed border-none"
            >
              {isSubmitting ? "Criando..." : "Criar Projeto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
