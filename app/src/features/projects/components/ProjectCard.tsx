import React, { useState, useRef, useEffect } from "react";
import type { Project } from "../../../types";
import {
  MoreVertical,
  Folder,
  Edit2,
  Trash2,
  Calendar,
  ArrowRight,
} from "lucide-react";

type ProjectCardProps = {
  project: Project;
  onClick: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export const ProjectCard = ({
  project,
  onClick,
  onEdit,
  onDelete,
}: ProjectCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = () => {
    onClick(project);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditOption = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEdit(project);
  };

  const handleDeleteOption = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete(project);
  };

  return (
    <div
      className="group relative flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-blue-900/10 cursor-pointer"
      onClick={handleCardClick}
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 text-blue-400 ring-1 ring-white/5 transition-transform group-hover:scale-110 group-hover:from-blue-600/30 group-hover:to-indigo-600/30">
            <Folder size={24} />
          </div>

          <div className="relative" ref={menuRef}>
            <button
              className={`rounded-lg p-1.5 transition-all hover:bg-slate-800 hover:text-white ${
                isMenuOpen
                  ? "bg-slate-800 text-white"
                  : "text-slate-500 hover:bg-slate-800/50"
              }`}
              onClick={toggleMenu}
            >
              <MoreVertical size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-8 z-20 w-40 origin-top-right rounded-xl border border-slate-700/50 bg-slate-900/90 p-1 shadow-xl backdrop-blur-xl ring-1 ring-black/20 animate-fade-in-down">
                <button
                  onClick={handleEditOption}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-blue-400"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  onClick={handleDeleteOption}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-100 transition-colors group-hover:text-blue-200">
          {project.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
          {project.description || "Sem descrição definida."}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Calendar size={14} />
          {new Date(project.createdAt).toLocaleDateString()}
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-blue-500 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
          Abrir <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};
