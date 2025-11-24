import React from "react";
import { Button } from "../../../components/common/Button";
import { useTestCases } from "../hooks/useTestCases";
import type { TestCase } from "../../../types";

type TestCaseListProps = {
  useCaseId: string | number;
};

export const TestCaseList = ({ useCaseId }: TestCaseListProps) => {
  const { loading, error, testCases } = useTestCases(useCaseId);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-5 text-center text-sm text-slate-400">
          Carregando casos de teste...
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-5 text-center text-sm text-red-400">
          Erro ao carregar testes: {error}
        </div>
      );
    }

    if (testCases.length === 0) {
      return (
        <div className="p-5 text-center text-sm text-slate-400">
          Nenhum caso de teste gerado para este Caso de Uso.
        </div>
      );
    }

    return (
      <div className="divide-y divide-slate-700/50">
        {testCases.map((test: TestCase) => (
          <div
            key={test.id}
            className="flex items-center justify-between p-4 transition-colors hover:bg-slate-700/50"
          >
            <div>
              <span className="text-xs font-semibold uppercase text-blue-400">
                Teste {test.id}
              </span>
              <p className="font-medium text-slate-200">
                {test.expectedResult.substring(0, 50)}...
              </p>
            </div>

            <button
              className="flex-shrink-0 text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline"
              onClick={() => {
                alert(`Navegar para detalhes do teste: ${test.id}`); // Implementar a navegação para a tela de detalhes
              }}
            >
              Visualizar Detalhes
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Casos de Teste Gerados
        </h3>
      </div>
      <div className="overflow-hidden rounded-md border border-slate-700 bg-slate-800 text-slate-200">
        {renderContent()}
      </div>
    </section>
  );
};
