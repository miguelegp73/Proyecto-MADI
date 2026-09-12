export interface MadiWakePhraseDetectionResult {
  detected: boolean;
  phrase?: string;
  confidence?: number;
}

/**
 * Natural-language activation boundary. A detector may accept the canonical
 * name alone or contextual greetings addressed to M.A.D.I.
 */
export interface MadiWakePhraseDetector {
  detect(audio: Uint8Array, audioFormat: string): Promise<MadiWakePhraseDetectionResult>;
}

/**
 * Canonical identity token. Natural variants must resolve to the same target.
 */
export const MADI_WAKE_NAME = 'M.A.D.I.';
