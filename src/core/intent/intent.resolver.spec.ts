import { BasicIntentResolver } from './intent.resolver';

describe('BasicIntentResolver', () => {
  const resolver = new BasicIntentResolver();

  it('classifies a greeting', async () => {
    await expect(resolver.resolve('Hola M.A.D.I.')).resolves.toEqual({
      name: 'conversation.greeting',
      domain: 'conversation',
      confidence: 0.99,
      requiresClarification: false,
    });
  });

  it('classifies a local time request', async () => {
    await expect(resolver.resolve('M.A.D.I., ¿qué hora es?')).resolves.toEqual({
      name: 'information.time',
      domain: 'information',
      confidence: 0.96,
      requiresClarification: false,
    });
  });

  it('requests clarification for empty input', async () => {
    await expect(resolver.resolve('   ')).resolves.toEqual({
      name: 'unknown.empty',
      domain: 'unknown',
      confidence: 1,
      requiresClarification: true,
    });
  });

  it('does not invent an intent for unclassified input', async () => {
    await expect(resolver.resolve('Necesito analizar la rentabilidad.')).resolves.toEqual({
      name: 'unknown.unclassified',
      domain: 'unknown',
      confidence: 0,
      requiresClarification: true,
    });
  });
});
