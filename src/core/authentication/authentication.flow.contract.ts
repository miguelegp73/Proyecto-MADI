import {
  MadiCredentialAuthenticationRequest,
  MadiCredentialAuthenticationResult,
} from './credential.contract';
import {
  MadiAuthenticatedIdentity,
  MadiSpeakerRecognitionRequest,
  MadiSpeakerRecognitionResult,
} from './identity.contract';

export type MadiAuthenticationMethod = 'voice' | 'credential';

export interface MadiAuthenticationResult {
  authenticated: boolean;
  method?: MadiAuthenticationMethod;
  identity?: MadiAuthenticatedIdentity;
  voice?: MadiSpeakerRecognitionResult;
  credential?: MadiCredentialAuthenticationResult;
}

/** Orchestration boundary for voice-first identity with credential fallback. */
export interface MadiAuthenticationFlow {
  authenticateByVoice(
    request: MadiSpeakerRecognitionRequest,
  ): Promise<MadiAuthenticationResult>;
  authenticateByCredential(
    request: MadiCredentialAuthenticationRequest,
  ): Promise<MadiAuthenticationResult>;
}
