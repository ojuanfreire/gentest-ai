import React, { useState, useRef, useEffect } from "react";
import type { UseCase } from "../../../types/index";
import { MoreVertical, Workflow, Edit2, Trash2, Calendar, User, ArrowRight } from "lucide-react";

type UseCaseCardProps = {
  useCase: UseCase;
  onViewClick: (useCase: UseCase) => void;
  onEditClick: (useCase: UseCase) => void;
  onDeleteClick: (useCase: UseCase) => void;
};

export const UseCaseCard = ({
  useCase,
  onViewClick,
  onEditClick,
  onDeleteClick,
}: UseCaseCardProps) => {
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
    onViewClick(useCase);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEditClick(useCase);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDeleteClick(useCase);
  };

  return (
    <div
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-blue-900/10 cursor-pointer"
      onClick={handleCardClick}
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 text-blue-400 ring-1 ring-white/5 transition-transform group-hover:scale-110 group-hover:from-blue-600/30 group-hover:to-indigo-600/30">
            <Workflow size={24} />
          </div>

          {/* Menu de Opções */}
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

            {/* Dropdown Menu Glass */}
            {isMenuOpen && (
              <div className="absolute right-0 top-8 z-20 w-40 origin-top-right rounded-xl border border-slate-700/50 bg-slate-900/90 p-1 shadow-xl backdrop-blur-xl ring-1 ring-black/20 animate-fade-in-down">
                <button
                  onClick={handleEdit}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-blue-400"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo Principal*/}
        <h3 className="text-lg font-bold text-slate-100 transition-colors group-hover:text-blue-200 line-clamp-1">
          {useCase.name}
        </h3>
        
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400 min-h-[40px]">
          {useCase.description || "Sem descrição definida."}
        </p>
      </div>

      {/* Footer do Card */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <User size={12} />
                <span className="truncate max-w-[120px]">{useCase.actor}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Calendar size={12} />
                {new Date(useCase.createdAt || Date.now()).toLocaleDateString()}
            </div>
        </div>
        
        {/* Seta indicativa */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 opacity-0 transition-all group-hover:opacity-100 group-hover:bg-blue-600 group-hover:text-white">
            <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};