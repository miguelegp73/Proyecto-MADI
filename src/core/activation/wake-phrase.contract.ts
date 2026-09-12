export const MADI_WAKE_PHRASE = 'Hola M.A.D.I.';

export interface MadiWakePhraseDetectionResult {
  detected: boolean;
  phrase?: string;
  confidence?: number;
}

/** Activation is intentionally separate from identity and authorization. */
export interface MadiWakePhraseDetector {
  detect(audio: Uint8Array, audioFormat: string): Promise<MadiWakePhraseDetectionResult>;
}
