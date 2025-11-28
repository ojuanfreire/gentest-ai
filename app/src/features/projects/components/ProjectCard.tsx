import React, { useState, useRef, useEffect } from "react";
import type { Project } from "../../../types";
import { ChevronDown, Folder, Edit2, Trash2 } from "lucide-react";

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

  // Fecha o menu se clicar fora dele
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
      className="group relative flex cursor-pointer flex-col justify-between rounded-lg border border-slate-700 bg-slate-800 p-5 shadow-lg transition-all hover:border-slate-600 hover:bg-slate-750 hover:shadow-blue-900/10"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
            <Folder size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors">
              {project.name}
            </h3>
            <span className="text-xs text-slate-500">
              Criado em {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            className={`rounded-full p-1 transition-all hover:bg-slate-700 hover:text-white ${
              isMenuOpen
                ? "bg-slate-700 text-white opacity-100"
                : "text-slate-400 opacity-0 group-hover:opacity-100"
            }`}
            aria-label="Opções do projeto"
            onClick={toggleMenu}
          >
            <ChevronDown className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 z-20 w-48 rounded-md border border-slate-700 bg-slate-800 shadow-xl ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={handleEditOption}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  onClick={handleDeleteOption}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-slate-400">
        {project.description}
      </p>
    </div>
  );
};
