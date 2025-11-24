export type User = {
  id: string;
  name: string;
  email: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
};

export type TestCase = {
  id: string;
  useCaseId: string;
  title: string;
  description: string;
  steps: string;
  expectedResult: string;
};

export type SkeletonFramework = "JavaScript + Cypress" | "Python + Playwright";

export type GeneratedSkeleton = {
  id: string;
  testCaseId: string;
  framework: SkeletonFramework;
  code: string;
  createdAt: string;
};

export type UseCase = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  createdAt: string;
  actor: string;
  preconditions: string;
  mainFlow: string;
  alternativeFlows: string;
};
