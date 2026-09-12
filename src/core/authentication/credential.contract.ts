import { MadiAuthenticatedIdentity } from './identity.contract';

export interface MadiCredentialAuthenticationRequest {
  credentialType: string;
  credential: string;
}

export interface MadiCredentialAuthenticationResult {
  authenticated: boolean;
  identity?: MadiAuthenticatedIdentity;
  error?: {
    code: string;
    message: string;
  };
}

/** Secondary authentication boundary. Concrete credential mechanisms stay outside core. */
export interface MadiCredentialAuthenticator {
  authenticate(
    request: MadiCredentialAuthenticationRequest,
  ): Promise<MadiCredentialAuthenticationResult>;
}
