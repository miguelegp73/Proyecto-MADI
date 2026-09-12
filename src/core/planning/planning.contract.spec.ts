import { BasicPlanner } from '../../application/planning/basic.planner';

describe('BasicPlanner', () => {
  it('creates a plan without inventing execution steps', async () => {
    const planner = new BasicPlanner();
    await expect(planner.plan({ goal: 'Test', context: {} })).resolves.toEqual({ goal: 'Test', steps: [] });
  });
});
