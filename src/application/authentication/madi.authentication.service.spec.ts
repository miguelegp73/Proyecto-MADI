import { MadiAuthenticationService } from './madi.authentication.service';
import { MadiCredentialAuthenticator } from '../../core/authentication/credential.contract';
import { MadiSpeakerRecognitionGateway } from '../../core/authentication/identity.contract';

describe('MadiAuthenticationService', () => {
  const request = {
    audioFormat: 'audio/webm',
    audio: new Uint8Array([1, 2, 3]),
    language: 'es-AR',
  };

  it('authenticates a reliably identified speaker', async () => {
    const speaker: MadiSpeakerRecognitionGateway = {
      recognize: jest.fn().mockResolvedValue({
        decision: 'identified',
        confidence: 0.98,
        userId: 'miguel',
      }),
    };
    const credential: MadiCredentialAuthenticator = {
      authenticate: jest.fn(),
    };

    const service = new MadiAuthenticationService(speaker, credential);
    const result = await service.authenticateByVoice(request);

    expect(result.authenticated).toBe(true);
    expect(result.method).toBe('voice');
    expect(result.identity).toEqual({ userId: 'miguel', method: 'voice' });
    expect(credential.authenticate).not.toHaveBeenCalled();
  });

  it('does not identify an ambiguous speaker', async () => {
    const speaker: MadiSpeakerRecognitionGateway = {
      recognize: jest.fn().mockResolvedValue({
        decision: 'ambiguous',
        confidence: 0.51,
      }),
    };
    const credential: MadiCredentialAuthenticator = {
      authenticate: jest.fn(),
    };

    const service = new MadiAuthenticationService(speaker, credential);
    const result = await service.authenticateByVoice(request);

    expect(result.authenticated).toBe(false);
    expect(result.identity).toBeUndefined();
  });

  it('does not identify an unknown speaker', async () => {
    const speaker: MadiSpeakerRecognitionGateway = {
      recognize: jest.fn().mockResolvedValue({
        decision: 'unknown',
        confidence: 0.12,
      }),
    };
    const credential: MadiCredentialAuthenticator = {
      authenticate: jest.fn(),
    };

    const service = new MadiAuthenticationService(speaker, credential);
    const result = await service.authenticateByVoice(request);

    expect(result.authenticated).toBe(false);
    expect(result.identity).toBeUndefined();
  });

  it('authenticates through the secondary credential path', async () => {
    const speaker: MadiSpeakerRecognitionGateway = { recognize: jest.fn() };
    const credential: MadiCredentialAuthenticator = {
      authenticate: jest.fn().mockResolvedValue({
        authenticated: true,
        identity: { userId: 'miguel', method: 'credential' },
      }),
    };

    const service = new MadiAuthenticationService(speaker, credential);
    const result = await service.authenticateByCredential({
      credentialType: 'pending',
      credential: 'provided-by-interface',
    });

    expect(result.authenticated).toBe(true);
    expect(result.method).toBe('credential');
    expect(result.identity).toEqual({ userId: 'miguel', method: 'credential' });
  });
});
