import { supabase } from "../../../api/supabaseClient";
import type { CodeSkeleton, TestCase, SkeletonFramework } from "../../../types";
import { aiGenerationService } from "../../ai/services/aiGenerationService";

// Banco (snake_case) -> Frontend (camelCase)
const fromDbToSkeleton = (dbData: any): CodeSkeleton => ({
  id: dbData.id.toString(),
  testCaseId: dbData.test_case_id.toString(),
  framework: dbData.framework,
  generatedCode: dbData.generated_code,
  createdAt: dbData.created_at,
});

const getSkeletonsByTestCaseId = async (testCaseId: string): Promise<CodeSkeleton[]> => {
  const { data, error } = await supabase
    .from("code_skeletons")
    .select("*")
    .eq("test_case_id", testCaseId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data.map(fromDbToSkeleton);
};

const getSkeletonById = async (id: string): Promise<CodeSkeleton> => {
  const { data, error } = await supabase
    .from("code_skeletons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return fromDbToSkeleton(data);
};

const generateSkeleton = async (testCase: TestCase,framework: SkeletonFramework): Promise<CodeSkeleton> => {
  const code = await aiGenerationService.generateCodeSkeleton(testCase, framework);

  const { data: dbData, error: dbError } = await supabase
    .from("code_skeletons")
    .insert({
      test_case_id: testCase.id,
      framework: framework,
      generated_code: code,
    })
    .select()
    .single();

  if (dbError) throw new Error("Erro ao salvar esqueleto: " + dbError.message);

  return fromDbToSkeleton(dbData);
};

const deleteSkeleton = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("code_skeletons")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};

export const codeSkeletonService = {
  getSkeletonsByTestCaseId,
  getSkeletonById,
  generateSkeleton,
  deleteSkeleton,
};