import {
  MadiVerifier,
  MadiVerificationRequest,
  MadiVerificationResult,
} from './verification.contract';

export class BasicVerifier implements MadiVerifier {
  async verify(
    request: MadiVerificationRequest,
  ): Promise<MadiVerificationResult> {
    if (request.expected === undefined) {
      return {
        verified: true,
        reason: 'La ejecución terminó sin una condición esperada para comparar.',
      };
    }

    const verified = JSON.stringify(request.expected) === JSON.stringify(request.actual);

    return {
      verified,
      reason: verified
        ? 'El resultado coincide con lo esperado.'
        : 'El resultado no coincide con lo esperado.',
    };
  }
}
