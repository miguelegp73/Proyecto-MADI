import {
  MADI_WAKE_NAME,
  MadiWakePhraseDetectionResult,
  MadiWakePhraseDetector,
} from '../../core/activation/wake-phrase.contract';

/** Deterministic text/STT adapter for natural activation addressed to M.A.D.I. */
export class NaturalWakePhraseDetector {
  constructor(private readonly detector: MadiWakePhraseDetector | undefined = undefined) {}

  detectText(text: string): MadiWakePhraseDetectionResult {
    const normalized = this.normalize(text);
    const name = this.normalize(MADI_WAKE_NAME);
    if (!this.containsNameToken(normalized, name)) return { detected: false };
    return { detected: true, phrase: text.trim(), confidence: 1 };
  }

  async detect(audio: Uint8Array, audioFormat: string): Promise<MadiWakePhraseDetectionResult> {
    if (!this.detector) return { detected: false };
    return this.detector.detect(audio, audioFormat);
  }

  private containsNameToken(text: string, name: string): boolean {
    return text === name || text.startsWith(`${name} `) || text.endsWith(` ${name}`) || text.includes(` ${name} `);
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[.,!?;:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\bm\s+a\s+d\s+i\b/g, 'madi');
  }
}
