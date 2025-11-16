import { supabase } from "../../../api/supabaseClient";
import type { UseCase, TestCase } from "../../../types";
import type { UseCaseFormData } from "../components/CreateUseCaseModal";

type GeneratedTestCase = {
  type: string;
  precondition: string;
  steps: string;
  expected_result: string;
};

const fromDbToUseCase = (dbData: any): UseCase => {
  return {
    id: dbData.id,
    title: dbData.title,
    description: dbData.description,
    projectId: dbData.project_id,
    createdAt: dbData.created_at,
    actor: dbData.actor,
    preconditions: dbData.preconditions,
    mainFlow: dbData.main_flow,
    alternativeFlows: dbData.alternative_flows,
  };
};

const fromUseCaseToDb = (formData: UseCaseFormData) => {
  return {
    title: formData.title,
    description: formData.description,
    actor: formData.actor,
    preconditions: formData.preconditions,
    main_flow: formData.mainFlow,
    alternative_flows: formData.alternativeFlows,
  };
};

const getUseCases = async (): Promise<UseCase[]> => {
  const { data, error } = await supabase.from("use_cases").select("*");

  if (error) {
    console.error("Erro ao buscar casos de uso:", error);
    throw new Error(error.message);
  }

  return data.map(fromDbToUseCase);
};

const getUseCaseById = async (id: string): Promise<UseCase> => {
  const { data, error } = await supabase
    .from("use_cases")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Erro ao buscar caso de uso por ID:", error);
    throw new Error(error.message);
  }

  return fromDbToUseCase(data);
};

const createUseCase = async (formData: UseCaseFormData): Promise<UseCase> => {
  const dbPayload = fromUseCaseToDb(formData);

  const { data, error } = await supabase
    .from("use_cases")
    .insert(dbPayload) // 2. Insere os dados traduzidos
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao criar caso de uso:", error);
    throw new Error(error.message);
  }

  return fromDbToUseCase(data);
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

const deleteUseCase = async (useCaseId: string): Promise<boolean> => {
  const { error } = await supabase
    .from("use_cases")
    .delete()
    .eq("id", useCaseId);

  if (error) {
    console.error("Erro ao deletar caso de uso:", error);
    throw new Error(error.message);
  }
  return true;
};

const getTestCases = async (useCaseId: string): Promise<TestCase[]> => {
  const { data, error } = await supabase
    .from("test_cases")
    .select("*")
    .eq("use_case_id", useCaseId);

  if (error) {
    console.error("Erro ao buscar casos de teste:", error);
    throw new Error(error.message);
  }
  
  // Precisamos traduzir a saída de 'test_cases' também
  return data.map((dbData: any): TestCase => ({
    id: dbData.id,
    createdAt: dbData.created_at,
    type: dbData.type,
    precondition: dbData.precondition,
    steps: dbData.steps,
    expectedResult: dbData.expected_result,
    useCaseId: dbData.use_case_id,
  }));
};

export const useCaseService = {
  getUseCases,
  getUseCaseById,
  createUseCase,
  deleteUseCase,
  createTestCases,
  getTestCases,
};