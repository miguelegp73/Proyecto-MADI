export type MadiVoiceMode = 'input' | 'output';

export interface MadiVoiceInput {
  audioFormat: string;
  audio: Uint8Array;
  language?: string;
}

export interface MadiVoiceTranscript {
  text: string;
  confidence?: number;
  language?: string;
}

export interface MadiSpeechRequest {
  text: string;
  voiceId?: string;
  language?: string;
}

export interface MadiSpeechResult {
  audioFormat: string;
  audio: Uint8Array;
  durationMs?: number;
}

/** Voice boundary. STT/TTS providers and the future avatar stay outside core. */
export interface MadiVoiceGateway {
  transcribe(input: MadiVoiceInput): Promise<MadiVoiceTranscript>;
  synthesize(request: MadiSpeechRequest): Promise<MadiSpeechResult>;
}
