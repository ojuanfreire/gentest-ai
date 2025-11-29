import { supabase } from "../../../api/supabaseClient";
import type { UseCase, TestCase, SkeletonFramework } from "../../../types";

type EdgeFunctionPayload = {
  name: string;
  actor: string;
  preConditions: string;
  mainFlow: string;
  alternativeFlows: string;
};

type GeneratedTestCase = {
  title: string;
  description: string;
  type: string;
  precondition: string;
  steps: string;
  expected_result: string;
};

const generateTestCases = async (useCase: UseCase): Promise<GeneratedTestCase[]> => {
  const payload: EdgeFunctionPayload = {
    name: useCase.name,
    actor: useCase.actor,
    preConditions: useCase.preconditions,
    mainFlow: useCase.mainFlow,
    alternativeFlows: useCase.alternativeFlows,
  };

  const { data, error } = await supabase.functions.invoke("generate-test-cases", {
    body: { useCase: payload },
  });

  if (error) {
    throw new Error("Erro na IA (Test Cases): " + error.message);
  }

  return data;
};

const generateCodeSkeleton = async ( testCase: TestCase, framework: SkeletonFramework): Promise<string> => {
  const { data, error } = await supabase.functions.invoke("generate-code-skeleton", {
    body: { testCase, framework },
  });

  if (error) {
    throw new Error("Erro na IA (Code Skeleton): " + error.message);
  }

  if (!data?.code) {
    throw new Error("A IA não retornou um código válido.");
  }

  return data.code;
};

export const aiGenerationService = {
  generateTestCases,
  generateCodeSkeleton,
};