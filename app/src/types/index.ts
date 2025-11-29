export type User = {
  id: string;
  name: string;
  email: string;
};

export type Project = {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
};

export type UseCase = {
  id: string;
  name: string;
  description: string;
  projectId: string;
  createdAt: string;
  actor: string;
  preconditions: string;
  mainFlow: string;
  alternativeFlows: string;
};

export type TestCase = {
  id: string;
  title: string;
  description: string;
  useCaseId: string;
  type: string;
  createdAt?: string;
  precondition: string;
  steps: string;
  expectedResult: string;
};

export type CodeSkeleton = {
  id: string;
  createdAt: string;
  testCaseId: string;
  framework: string;
  generatedCode: string;
};

export type SkeletonFramework = "JavaScript + Cypress" | "Python + Playwright";
