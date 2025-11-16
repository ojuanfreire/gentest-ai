import React from "react";

import type { UseCase } from "../../../types/index.ts";
import { ChevronDown } from "lucide-react";

type UseCaseCardProps = {
  useCase: UseCase;
  onViewClick: (useCase: UseCase) => void;
  onEditClick: (useCase: UseCase) => void;
};

export const UseCaseCard = ({
  useCase,
  onViewClick,
  onEditClick,
}: UseCaseCardProps) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick(useCase);
  };

  const handleViewClick = () => {
    onViewClick(useCase);
  };

  return (
    <div
      className="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-lg transition-all hover:border-slate-600 hover:shadow-blue-900/20 cursor-pointer"
      onClick={handleViewClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{useCase.title}</h3>

        <button
          className="rounded-full p-1 hover:bg-slate-600"
          aria-label="Editar caso de uso"
          onClick={handleEditClick}
        >
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-400">{useCase.description}</p>
    </div>
  );
};
