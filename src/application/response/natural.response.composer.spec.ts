import { NaturalResponseComposer } from './natural.response.composer';

describe('NaturalResponseComposer', () => {
  const composer = new NaturalResponseComposer();

  it('answers greetings naturally', () => {
    expect(composer.compose({ requestId: '1', timestamp: '', status: 'completed', intent: { name: 'conversation.greeting' } })).toBe('¡Hola! ¿En qué puedo ayudarte?');
  });

  it('uses capability output text when available', () => {
    expect(composer.compose({ requestId: '1', timestamp: '', status: 'completed', execution: [{ result: { output: { text: 'Son las 15:30:00.' } } }] })).toBe('Son las 15:30:00.');
  });

  it('does not hide authorization requirements', () => {
    expect(composer.compose({ requestId: '1', timestamp: '', status: 'needs_authorization', authorization: { required: true, reason: 'Confirmación requerida' } })).toBe('Confirmación requerida');
  });
});
