import React, { useState, useRef, useEffect } from "react";
import type { UseCase } from "../../../types/index.ts";
import { ChevronDown, Workflow, Edit2, Trash2 } from "lucide-react";

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
      className="group relative rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-lg transition-all hover:border-slate-600 hover:bg-slate-750 hover:shadow-emerald-900/10 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 transition-colors">
            <Workflow size={20} />
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-white group-hover:text-emerald-200 transition-colors">
              {useCase.name}
            </h3>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            className={`rounded-full p-1 transition-all hover:bg-slate-600 ${
              isMenuOpen
                ? "bg-slate-600 text-white opacity-100"
                : "text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-white"
            }`}
            aria-label="Opções do caso de uso"
            onClick={toggleMenu}
          >
            <ChevronDown className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-8 z-20 w-48 rounded-md border border-slate-700 bg-slate-800 shadow-xl ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={handleEdit}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
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

      <p className="mt-3 text-sm text-slate-400 line-clamp-2">
        {useCase.description}
      </p>
    </div>
  );
};
