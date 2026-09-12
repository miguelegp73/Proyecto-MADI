import { MadiPlan, MadiPlanner, MadiPlanningInput } from '../../core/planning/planning.contract';

export class BasicPlanner implements MadiPlanner {
  async plan(input: MadiPlanningInput): Promise<MadiPlan> {
    const intent = input.context.intent as { name?: string } | undefined;

    if (intent?.name === 'information.madi.status') {
      return { goal: input.goal, steps: [{ id: 'status-001', description: 'Consultar el estado operativo de M.A.D.I.', capabilityId: 'madi.status', operation: 'execute', requiresAuthorization: false }] };
    }
    if (intent?.name === 'information.time') {
      return { goal: input.goal, steps: [{ id: 'time-001', description: 'Consultar la hora local.', capabilityId: 'system.time', operation: 'execute', requiresAuthorization: false }] };
    }
    if (intent?.name === 'information.madi.capabilities') {
      return { goal: input.goal, steps: [{ id: 'capabilities-001', description: 'Consultar las capacidades registradas de M.A.D.I.', capabilityId: 'madi.capabilities', operation: 'execute', requiresAuthorization: false }] };
    }

    return { goal: input.goal, steps: [] };
  }
}
