import { supabase } from "../../../api/supabaseClient";
import type { UseCase, TestCase } from "../../../types";
import type { UseCaseFormData } from "../components/CreateUseCaseModal";

type GeneratedTestCase = {
  title: string;
  type: string;
  description: string;
  precondition: string;
  steps: string;
  expected_result: string;
};

const fromDbToTestCase = (dbData: any): TestCase => ({
  id: dbData.id.toString(),
  createdAt: dbData.created_at,
  title: dbData.title || `Teste ${dbData.id}`,
  description: dbData.description || "",
  type: dbData.type,
  precondition: dbData.precondition,
  steps: dbData.steps,
  expectedResult: dbData.expected_result,
  useCaseId: dbData.use_case_id.toString(),
});

// Banco (snake_case) -> Frontend (camelCase)
const fromDbToUseCase = (dbData: any): UseCase => {
  return {
    id: dbData.id.toString(),
    name: dbData.name,
    description: dbData.description,
    projectId: dbData.project_id.toString(),
    createdAt: dbData.created_at,
    actor: dbData.actor,
    preconditions: dbData.preconditions,
    mainFlow: dbData.main_flow,
    alternativeFlows: dbData.alternative_flows,
  };
};

// Frontend (camelCase) -> Banco (snake_case)
const fromUseCaseToDb = (formData: UseCaseFormData, projectId: string) => {
  return {
    project_id: projectId,
    name: formData.name,
    description: formData.description,
    actor: formData.actor,
    preconditions: formData.preconditions,
    main_flow: formData.mainFlow,
    alternative_flows: formData.alternativeFlows,
  };
};

const getUseCases = async (projectId: string): Promise<UseCase[]> => {
  const { data, error } = await supabase
    .from("use_cases")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

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

const createUseCase = async (
  formData: UseCaseFormData,
  projectId: string
): Promise<UseCase> => {
  const dbPayload = fromUseCaseToDb(formData, projectId);

  const { data, error } = await supabase
    .from("use_cases")
    .insert(dbPayload)
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao criar caso de uso:", error);
    throw new Error(error.message);
  }

  return fromDbToUseCase(data);
};

// Função para salvar todos os casos de teste gerados
const createTestCases = async (
  tests: GeneratedTestCase[],
  useCaseId: string
) => {
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
    .eq("use_case_id", useCaseId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Erro ao buscar casos de teste:", error);
    throw new Error(error.message);
  }

  return data.map(fromDbToTestCase);
};

const updateTestCase = async (testCase: TestCase): Promise<TestCase> => {
  const dbPayload = {
    title: testCase.title,
    description: testCase.description,
    type: testCase.type,
    precondition: testCase.precondition,
    steps: testCase.steps,
    expected_result: testCase.expectedResult,
  };

  const { data, error } = await supabase
    .from("test_cases")
    .update(dbPayload)
    .eq("id", testCase.id)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar caso de teste:", error);
    throw new Error(error.message);
  }

  return fromDbToTestCase(data);
};

const deleteTestCaseById = async (testCaseId: string): Promise<boolean> => {
  const { error } = await supabase
    .from("test_cases")
    .delete()
    .eq("id", testCaseId);

  if (error) {
    console.error("Erro ao excluir caso de teste:", error);
    throw new Error(error.message);
  }
  return true;
};

const updateUseCase = async (useCase: UseCase): Promise<UseCase> => {
  // Adapter Inline: Frontend (Camel) -> Banco (Snake)
  const dbPayload = {
    name: useCase.name,
    description: useCase.description,
    actor: useCase.actor,
    preconditions: useCase.preconditions,
    main_flow: useCase.mainFlow,
    alternative_flows: useCase.alternativeFlows,
  };

  const { data, error } = await supabase
    .from("use_cases")
    .update(dbPayload)
    .eq("id", useCase.id)
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao atualizar caso de uso:", error);
    throw new Error(error.message);
  }

  return fromDbToUseCase(data);
};

export const useCaseService = {
  getUseCases,
  getUseCaseById,
  createUseCase,
  updateUseCase,
  deleteUseCase,
  createTestCases,
  getTestCases,
  updateTestCase,
  deleteTestCaseById,
};