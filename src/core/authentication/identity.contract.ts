export type MadiIdentityDecision = 'identified' | 'unknown' | 'ambiguous' | 'unavailable';

export interface MadiSpeakerRecognitionRequest {
  audioFormat: string;
  audio: Uint8Array;
  language?: string;
}

export interface MadiSpeakerRecognitionResult {
  decision: MadiIdentityDecision;
  confidence: number;
  userId?: string;
  displayName?: string;
}

/** Provider-neutral speaker identity boundary. Recognition never grants authorization. */
export interface MadiSpeakerRecognitionGateway {
  recognize(request: MadiSpeakerRecognitionRequest): Promise<MadiSpeakerRecognitionResult>;
}

export interface MadiAuthenticatedIdentity {
  userId: string;
  displayName?: string;
  method: 'voice' | 'credential';
}
