import { TextWakePhraseDetector } from './text.wake-phrase.detector';

describe('TextWakePhraseDetector', () => {
  const detector = new TextWakePhraseDetector();

  it('detects the configured wake phrase case-insensitively', () => {
    expect(detector.detectText('hola m.a.d.i.')).toMatchObject({ detected: true, confidence: 1 });
  });

  it('detects the wake phrase with accent and spacing variations', () => {
    expect(detector.detectText('¡Hola   M.A.D.I.!')).toMatchObject({ detected: true });
  });

  it('does not authenticate the user', () => {
    const result = detector.detectText('Hola M.A.D.I. soy Miguel');
    expect(result.detected).toBe(true);
    expect(result).not.toHaveProperty('userId');
  });

  it('removes the wake phrase from an utterance', () => {
    expect(detector.removeWakePhrase('Hola M.A.D.I. necesito ayuda')).toBe('necesito ayuda');
  });
});
