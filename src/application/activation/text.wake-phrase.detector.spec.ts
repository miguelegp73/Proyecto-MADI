import { TextWakePhraseDetector } from './text.wake-phrase.detector';

describe('TextWakePhraseDetector', () => {
  const detector = new TextWakePhraseDetector();

  it.each([
    'M.A.D.I.',
    'MADI',
    'Hola M.A.D.I.',
    'Buen día M.A.D.I.',
    'Buenos días, M.A.D.I.',
    'Buenas tardes M.A.D.I.',
    'Buenas noches, M.A.D.I.',
    'M.A.D.I., necesito ayuda',
  ])('detects natural activation: %s', (utterance) => {
    expect(detector.detectText(utterance)).toMatchObject({ detected: true, confidence: 1 });
  });

  it('handles accents, punctuation and spacing variations', () => {
    expect(detector.detectText('¡Buenas   noches, M.A.D.I.!')).toMatchObject({ detected: true });
  });

  it('does not authenticate the user', () => {
    const result = detector.detectText('Hola M.A.D.I. soy Miguel');
    expect(result.detected).toBe(true);
    expect(result).not.toHaveProperty('userId');
  });

  it('removes the M.A.D.I. name from a natural utterance', () => {
    expect(detector.removeWakePhrase('Hola M.A.D.I. necesito ayuda')).toBe('hola necesito ayuda');
    expect(detector.removeWakePhrase('Buenas noches, M.A.D.I. necesito ayuda')).toBe('buenas noches necesito ayuda');
  });

  it('does not detect unrelated speech', () => {
    expect(detector.detectText('Buenas noches, Miguel')).toMatchObject({ detected: false });
  });
});
