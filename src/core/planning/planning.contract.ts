export interface MadiPlanStep {
  id: string;
  description: string;
  capabilityId?: string;
  operation?: string;
  input?: Record<string, unknown>;
  expected?: unknown;
  requiresAuthorization: boolean;
}

export interface MadiPlan {
  goal: string;
  steps: MadiPlanStep[];
}

export interface MadiPlanner {
  plan(input: MadiPlanningInput): Promise<MadiPlan>;
}

export interface MadiPlanningInput {
  goal: string;
  context: Record<string, unknown>;
}
