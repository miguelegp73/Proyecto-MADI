import { NaturalWakePhraseDetector } from './natural.wake.phrase.detector';

describe('NaturalWakePhraseDetector', () => {
  const detector = new NaturalWakePhraseDetector();

  it.each([
    'M.A.D.I.',
    'MADI',
    'Hola M.A.D.I.',
    'Buen día M.A.D.I.',
    'Buenas noches M.A.D.I.',
    'Buenos días, M.A.D.I., ¿estás ahí?',
    'M.A.D.I., necesito ayuda',
  ])('detecta la variante natural: %s', (text) => {
    expect(detector.detectText(text).detected).toBe(true);
  });

  it('ignora menciones que no contienen el nombre', () => {
    expect(detector.detectText('Hola, ¿cómo estás?').detected).toBe(false);
  });

  it('no autentica al usuario', () => {
    const result = detector.detectText('Buen día M.A.D.I.');
    expect(result.detected).toBe(true);
    expect(result).not.toHaveProperty('userId');
  });
});
