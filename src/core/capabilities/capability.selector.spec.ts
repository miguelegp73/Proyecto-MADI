import { BasicCapabilitySelector } from './capability.selector';

describe('BasicCapabilitySelector', () => {
  const selector = new BasicCapabilitySelector();
  it('does not select a capability for conversation intents', async () => {
    const result = await selector.select({ name: 'conversation.greeting', domain: 'conversation', confidence: 1, requiresClarification: false }, []);
    expect(result.capabilityId).toBeUndefined();
  });
  it('selects the only available capability for an action intent', async () => {
    const result = await selector.select({ name: 'action.test', domain: 'action', confidence: 1, requiresClarification: false }, [{ id: 'test', name: 'Test', description: '', risk: 'low', requiresAuthorization: false, execute: jest.fn() }]);
    expect(result.capabilityId).toBe('test');
  });
});
