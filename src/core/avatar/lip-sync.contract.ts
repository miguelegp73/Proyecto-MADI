export type MadiViseme =
  | 'sil'
  | 'PP'
  | 'FF'
  | 'TH'
  | 'DD'
  | 'KK'
  | 'CH'
  | 'SS'
  | 'NN'
  | 'RR'
  | 'AA'
  | 'EE'
  | 'OO';

export interface MadiVisemeFrame {
  startMs: number;
  endMs: number;
  viseme: MadiViseme;
  weight?: number;
}

export interface MadiLipSyncTrack {
  durationMs: number;
  frames: readonly MadiVisemeFrame[];
}

export interface MadiLipSyncInput {
  text: string;
  language?: string;
  audioFormat?: string;
  audio?: Uint8Array;
}

/**
 * Provider-neutral boundary for phoneme/viseme timing.
 * Implementations may obtain timing from TTS metadata, phoneme analysis,
 * or another trusted speech pipeline. The core does not assume a provider.
 */
export interface MadiLipSyncGateway {
  createTrack(input: MadiLipSyncInput): Promise<MadiLipSyncTrack>;
}
