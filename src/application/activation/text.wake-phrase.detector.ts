import {
  MADI_WAKE_PHRASE,
  MadiWakePhraseDetectionResult,
} from '../../core/activation/wake-phrase.contract';

/** Text-side adapter used by browser STT until a real audio wake-word provider is selected. */
export class TextWakePhraseDetector {
  detectText(text: string): MadiWakePhraseDetectionResult {
    const normalized = this.normalize(text);
    const phrase = this.normalize(MADI_WAKE_PHRASE);

    if (!normalized.includes(phrase)) {
      return { detected: false };
    }

    return { detected: true, phrase: MADI_WAKE_PHRASE, confidence: 1 };
  }

  removeWakePhrase(text: string): string {
    const phrase = this.normalize(MADI_WAKE_PHRASE);
    let normalized = this.normalize(text);

    if (normalized.startsWith(phrase)) {
      normalized = normalized.slice(phrase.length).trim();
    }

    return normalized;
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
}
