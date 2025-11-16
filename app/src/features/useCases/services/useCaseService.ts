import { supabase } from "../../../api/supabaseClient";
import type { UseCase } from "../../../types";
import type { UseCaseFormData } from "../components/CreateUseCaseModal";

type GeneratedTestCase = {
  type: string;
  precondition: string;
  steps: string;
  expected_result: string;
};

const getUseCases = async (): Promise<UseCase[]> => {
  const { data, error } = await supabase.from("use_cases").select("*");

  if (error) {
    console.error("Erro ao buscar casos de uso:", error);
    throw new Error(error.message);
  }

  return data;
};

const createUseCase = async (formData: UseCaseFormData): Promise<UseCase> => {
  const { data, error } = await supabase
    .from("use_cases")
    .insert(formData)
    .select("*");

  if (error) {
    console.error("Erro ao criar caso de uso:", error);
    throw new Error(error.message);
  }

  // Retornando o novo caso de uso criado
  return data[0];
};

// Função para salvar todos os casos de teste gerados
const createTestCases = async (tests: GeneratedTestCase[], useCaseId: string) => {
  const testsToInsert = tests.map((test) => ({
    ...test,
    use_case_id: useCaseId,
  }));

  const { error } = await supabase.from("test_cases").insert(testsToInsert);

  if (error) {
    console.error("Erro ao salvar casos de teste:", error);
    throw new Error(error.message);
  }

  return true;
};

export const useCaseService = { getUseCases, createUseCase, createTestCases, };