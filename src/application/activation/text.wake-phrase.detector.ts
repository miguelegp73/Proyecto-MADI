import {
  MADI_WAKE_NAME,
  MadiWakePhraseDetectionResult,
} from '../../core/activation/wake-phrase.contract';

/** Text/STT adapter for natural activation phrases addressed to M.A.D.I. */
export class TextWakePhraseDetector {
  detectText(text: string): MadiWakePhraseDetectionResult {
    const normalized = this.normalize(text);
    const name = this.normalize(MADI_WAKE_NAME);

    if (!this.containsNameToken(normalized, name)) {
      return { detected: false };
    }

    return { detected: true, phrase: text.trim(), confidence: 1 };
  }

  removeWakePhrase(text: string): string {
    const normalized = this.normalize(text);
    const name = this.normalize(MADI_WAKE_NAME);
    const index = normalized.indexOf(name);

    if (!this.containsNameToken(normalized, name) || index < 0) return normalized;

    return `${normalized.slice(0, index)} ${normalized.slice(index + name.length)}`
      .replace(/\s+/g, ' ')
      .trim();
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
