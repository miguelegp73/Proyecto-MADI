import {
  MadiCredentialAuthenticator,
} from '../../core/authentication/credential.contract';
import {
  MadiAuthenticationFlow,
  MadiAuthenticationResult,
} from '../../core/authentication/authentication.flow.contract';
import {
  MadiSpeakerRecognitionGateway,
  MadiSpeakerRecognitionRequest,
} from '../../core/authentication/identity.contract';
import { MadiCredentialAuthenticationRequest } from '../../core/authentication/credential.contract';

/** Coordinates voice identity with credential fallback without granting permissions. */
export class MadiAuthenticationService implements MadiAuthenticationFlow {
  constructor(
    private readonly speakerRecognition: MadiSpeakerRecognitionGateway,
    private readonly credentialAuthenticator: MadiCredentialAuthenticator,
  ) {}

  async authenticateByVoice(
    request: MadiSpeakerRecognitionRequest,
  ): Promise<MadiAuthenticationResult> {
    const voice = await this.speakerRecognition.recognize(request);

    if (voice.decision === 'identified' && voice.userId && voice.confidence > 0) {
      return {
        authenticated: true,
        method: 'voice',
        identity: { userId: voice.userId, method: 'voice' },
        voice,
      };
    }

    return { authenticated: false, voice };
  }

  async authenticateByCredential(
    request: MadiCredentialAuthenticationRequest,
  ): Promise<MadiAuthenticationResult> {
    const credential = await this.credentialAuthenticator.authenticate(request);

    if (credential.authenticated && credential.identity) {
      return {
        authenticated: true,
        method: 'credential',
        identity: credential.identity,
        credential,
      };
    }

    return { authenticated: false, credential };
  }
}
