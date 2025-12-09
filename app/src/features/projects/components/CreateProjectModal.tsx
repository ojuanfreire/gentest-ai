import React, { useState, useEffect } from "react";
import { X, FolderPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const inputClasses =
    "w-full rounded-lg border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none";
  const labelClasses =
    "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50"
          >
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 p-6 bg-slate-900/50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <FolderPlus size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">Novo Projeto</h2>
                </div>
                <Button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white border-none transition-colors"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-5 p-6">
                <div>
                  <label htmlFor="project-name" className={labelClasses}>
                    Nome do Projeto
                  </label>
                  <TextArea
                    id="project-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Sistema de Gestão Financeira"
                    required
                    autoFocus
                    rows={1}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="project-description" className={labelClasses}>
                    Descrição
                  </label>
                  <TextArea
                    id="project-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o objetivo do projeto..."
                    rows={4}
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-800 p-6 bg-slate-900/30 rounded-b-xl">
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
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50 border-none"
                >
                  {isSubmitting ? "Criando..." : "Criar Projeto"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
