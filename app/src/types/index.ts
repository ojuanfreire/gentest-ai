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
  title: string;
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
