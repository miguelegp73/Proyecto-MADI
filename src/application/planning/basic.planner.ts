import { MadiPlan, MadiPlanner, MadiPlanningInput } from '../../core/planning/planning.contract';

const APP_ALIASES: Record<string, string> = {
  calculadora: 'calculator',
  notepad: 'notepad',
  'bloc de notas': 'notepad',
  paint: 'paint',
  explorador: 'explorer',
  explorer: 'explorer',
};

export class BasicPlanner implements MadiPlanner {
  async plan(input: MadiPlanningInput): Promise<MadiPlan> {
    const intent = input.context.intent as { name?: string } | undefined;

    if (intent?.name === 'information.madi.status') return { goal: input.goal, steps: [{ id: 'status-001', description: 'Consultar el estado operativo de M.A.D.I.', capabilityId: 'madi.status', operation: 'execute', requiresAuthorization: false }] };
    if (intent?.name === 'information.time') return { goal: input.goal, steps: [{ id: 'time-001', description: 'Consultar la hora local.', capabilityId: 'system.time', operation: 'execute', requiresAuthorization: false }] };
    if (intent?.name === 'information.madi.capabilities') return { goal: input.goal, steps: [{ id: 'capabilities-001', description: 'Consultar las capacidades registradas de M.A.D.I.', capabilityId: 'madi.capabilities', operation: 'execute', requiresAuthorization: false }] };

    if (intent?.name === 'action.open-app') {
      const normalized = input.goal.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const alias = Object.keys(APP_ALIASES).find((key) => normalized.includes(key));
      if (!alias) return { goal: input.goal, steps: [] };
      const application = APP_ALIASES[alias];
      return {
        goal: input.goal,
        steps: [{
          id: 'open-app-001',
          description: `Abrir la aplicación ${alias}.`,
          capabilityId: 'system.open-app',
          operation: 'execute',
          input: { application },
          requiresAuthorization: true,
          expected: { openedApplication: application },
        }],
      };
    }

    if (intent?.name === 'action.open-url') {
      const match = input.goal.match(/\bhttps?:\/\/[^\s]+/i);
      const url = match?.[0]?.replace(/[.,!?;:]+$/, '');
      if (!url) return { goal: input.goal, steps: [{ id: 'open-url-001', description: 'Abrir el sitio web solicitado.', capabilityId: 'system.open-url', operation: 'execute', requiresAuthorization: true }] };
      return { goal: input.goal, steps: [{ id: 'open-url-001', description: `Abrir el sitio web ${url}.`, capabilityId: 'system.open-url', operation: 'execute', input: { url }, requiresAuthorization: true, expected: { openUrl: url } }] };
    }

    return { goal: input.goal, steps: [] };
  }
}
