import {
  MadiVerificationRequest,
  MadiVerificationResult,
  MadiVerifier,
} from '../../core/verification/verification.contract';

export class BasicVerifier implements MadiVerifier {
  async verify(request: MadiVerificationRequest): Promise<MadiVerificationResult> {
    if (request.expected === undefined) {
      return { verified: true };
    }

    const verified = JSON.stringify(request.expected) === JSON.stringify(request.actual);
    return verified
      ? { verified: true }
      : { verified: false, reason: 'El resultado no coincide con el resultado esperado.' };
  }
}
