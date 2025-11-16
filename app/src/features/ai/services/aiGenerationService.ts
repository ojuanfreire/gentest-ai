import { supabase } from "../../../api/supabaseClient";
import type { UseCase } from "../../../types";

type EdgeFunctionPayload = {
  name: string;
  actor: string;
  preConditions: string;
  mainFlow: string;
  alternativeFlows: string;
};

type GeneratedTestCase = {
  type: string;
  precondition: string;
  steps: string;
  expected_result: string;
};

const generateTestCases = async (useCase: UseCase): Promise<GeneratedTestCase[]> => {
  
  // Fazendo a adpatação de alguns campos do formato do frontend para o formato esperado pela Edge Function
  const payload: EdgeFunctionPayload = {
    name: useCase.title,
    actor: useCase.actor,
    preConditions: useCase.preconditions,
    mainFlow: useCase.mainFlow,
    alternativeFlows: useCase.alternativeFlows,
  };

  const { data, error } = await supabase.functions.invoke( "generate-test-cases", {
    body: { useCase: payload },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const aiGenerationService = { generateTestCases, };