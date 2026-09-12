import { MadiPlan, MadiPlanner, MadiPlanningInput } from '../../core/planning/planning.contract';

export class BasicPlanner implements MadiPlanner {
  async plan(input: MadiPlanningInput): Promise<MadiPlan> {
    return {
      goal: input.goal,
      steps: [],
    };
  }
}
