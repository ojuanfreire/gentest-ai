import React, { useState, useEffect } from "react";
import { Button } from "../../../components/common/Button";
import { TextArea } from "../../../components/common/TextArea";
import { X } from "lucide-react";
import type { Project } from "../../../types";

// Tipagem para os dados editáveis
export type ProjectEditFormData = Pick<Project, "name" | "description">;

type EditProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Project) => void;
  isSubmitting?: boolean;
  projectToEdit: Project | null;
};

export const EditProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  projectToEdit,
}: EditProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen && projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
    } else if (!isOpen) {
      setName("");
      setDescription("");
    }
  }, [isOpen, projectToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectToEdit) return;

    const updatedProject: Project = {
      ...projectToEdit,
      name,
      description,
    };
    onSubmit(updatedProject);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-xl bg-slate-800 shadow-2xl ring-1 ring-slate-700 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-700 p-6">
          <h2 className="text-xl font-bold text-white">Editar Projeto</h2>
          <Button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="overflow-y-auto p-6">
          <form
            id="edit-project-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <div>
              <label
                htmlFor="project-name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Nome do Projeto
              </label>
              <TextArea
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sistema de Gestão"
                required
                rows={1}
                className="resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="project-desc"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Descrição
              </label>
              <TextArea
                id="project-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo do projeto..."
                rows={4}
                required
              />
            </div>
          </form>
        </div>

        <div className="border-t border-slate-700 p-6 bg-slate-800/50 rounded-b-xl flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="edit-project-form"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>
    </div>
  );
};
