import { BasicIntentResolver } from './intent.resolver';

describe('BasicIntentResolver', () => {
  const resolver = new BasicIntentResolver();

  it('classifies a greeting', async () => {
    await expect(resolver.resolve('Hola M.A.D.I.')).resolves.toEqual({ name: 'conversation.greeting', domain: 'conversation', confidence: 0.99, requiresClarification: false });
  });

  it('classifies natural local time requests', async () => {
    const expected = { name: 'information.time', domain: 'information', confidence: 0.96, requiresClarification: false };
    await expect(resolver.resolve('M.A.D.I., ¿qué hora es?')).resolves.toEqual(expected);
    await expect(resolver.resolve('Qué hora es')).resolves.toEqual(expected);
    await expect(resolver.resolve('¿Me dices la hora?')).resolves.toEqual(expected);
    await expect(resolver.resolve('Decime la hora')).resolves.toEqual(expected);
  });

  it('classifies an authorized local application action', async () => {
    await expect(resolver.resolve('M.A.D.I., abre la calculadora')).resolves.toEqual({ name: 'action.open-app', domain: 'action', confidence: 0.95, requiresClarification: false });
  });

  it('requests clarification for empty input', async () => {
    await expect(resolver.resolve('   ')).resolves.toEqual({ name: 'unknown.empty', domain: 'unknown', confidence: 1, requiresClarification: true });
  });

  it('does not invent an intent for unclassified input', async () => {
    await expect(resolver.resolve('Necesito analizar la rentabilidad.')).resolves.toEqual({ name: 'unknown.unclassified', domain: 'unknown', confidence: 0, requiresClarification: true });
  });
});
