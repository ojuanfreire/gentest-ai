import React from "react";

import type { UseCase } from "../../../types/index.ts";
import { ChevronDown } from "lucide-react";

type UseCaseCardProps = {
  useCase: UseCase;
};

export const UseCaseCard = ({ useCase }: UseCaseCardProps) => {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-lg transition-all hover:border-slate-600 hover:shadow-blue-900/20">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{useCase.title}</h3>

        <button
          className="rounded-full p-1 hover:bg-slate-600"
          aria-label="Ver detalhes"
        >
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-400">{useCase.description}</p>
    </div>
  );
};
