import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';
import {
  MadiReasoningPort,
  MadiReasoningResult,
} from '../../core/reasoning/reasoning.port';

export class StubReasoningAdapter implements MadiReasoningPort {
  async reason(request: MadiInteractionRequest): Promise<MadiReasoningResult> {
    return {
      status: 'completed',
      data: [
        {
          type: 'reasoning_stub',
          message: 'M.A.D.I. recibió la solicitud y está listo para conectar un motor de razonamiento.',
          inputType: request.input.type,
        },
      ],
    };
  }
}
