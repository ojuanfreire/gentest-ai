import React from "react";
import { Wand2 } from "lucide-react";
import { Button } from "../../../components/common/Button";

// Dados Mockados
// Tipo definido somente para o Mock
type TestCase = {
  id: string;
  useCaseId: string;
  title: string;
  priority: string;
  status: string;
  steps: string;
  expectedResult: string;
};

// Mocks de Casos de Testes
const mockTestCases: TestCase[] = [
  {
    id: "tc-101",
    useCaseId: "uc-mock-view",
    title: "Caso de Teste 1: Validar com dados corretos",
    priority: "high",
    status: "pass",
    steps: "...",
    expectedResult: "...",
  },
  {
    id: "tc-102",
    useCaseId: "uc-mock-view",
    title: "Caso de Teste 2: Validar com dados inválidos",
    priority: "medium",
    status: "fail",
    steps: "...",
    expectedResult: "...",
  },
];

type TestCaseListProps = {
  useCaseId: string;
};

export const TestCaseList = ({ useCaseId }: TestCaseListProps) => {
  const testCases = mockTestCases.filter((tc) => tc.useCaseId === useCaseId);

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Casos de Teste gerados
        </h3>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-700 bg-slate-800 text-slate-200">
        {testCases.length === 0 ? (
          <div className="p-5 text-center text-slate-400 text-sm">
            Nenhum caso de teste gerado.
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {testCases.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors"
              >
                <span className="font-medium text-slate-200">{test.title}</span>

                <button
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                  onClick={() => {
                    // Lógica da navegação para página de detalhes do teste vem aqui
                    alert(`Navegar para detalhes do teste: ${test.id}`);
                  }}
                >
                  Visualizar Detalhes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
