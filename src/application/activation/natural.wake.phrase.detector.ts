import {
  MADI_WAKE_NAME,
  MadiWakePhraseDetectionResult,
  MadiWakePhraseDetector,
} from '../../core/activation/wake-phrase.contract';

/**
 * Deterministic text/STT adapter used while a real audio wake-word provider is
 * not selected. It recognizes the M.A.D.I. name in natural greetings without
 * authenticating the speaker.
 */
export class NaturalWakePhraseDetector {
  constructor(private readonly detector: MadiWakePhraseDetector | undefined = undefined) {}

  detectText(text: string): MadiWakePhraseDetectionResult {
    const normalized = this.normalize(text);
    const name = this.normalize(MADI_WAKE_NAME);

    if (!this.containsNameToken(normalized, name)) {
      return { detected: false };
    }

    return {
      detected: true,
      phrase: text.trim(),
      confidence: 1,
    };
  }

  async detect(audio: Uint8Array, audioFormat: string): Promise<MadiWakePhraseDetectionResult> {
    if (!this.detector) {
      return { detected: false };
    }

    return this.detector.detect(audio, audioFormat);
  }

  private containsNameToken(text: string, name: string): boolean {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|\\s)${escaped}(?:$|\\s)`).test(text);
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[.,!?;:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
