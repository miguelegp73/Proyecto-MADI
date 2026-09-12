import { MadiInteractionResponse } from '../../core/interaction/interaction.contract';
import {
  MadiVoiceGateway,
  MadiVoiceInput,
  MadiSpeechResult,
  MadiVoiceTranscript,
} from '../../core/voice/voice.contract';
import { ApplicationInterfaceGateway } from '../interface/madi.interface.gateway';

export interface MadiVoiceInteractionRequest {
  eventId: string;
  timestamp: string;
  applicationId?: string;
  audio: MadiVoiceInput;
  context?: Record<string, unknown>;
}

export interface MadiVoiceInteractionResult {
  transcript: MadiVoiceTranscript;
  response: MadiInteractionResponse;
  speech?: MadiSpeechResult;
}

/** Provider-neutral voice orchestration. STT/TTS implementations are injected later. */
export class VoiceInteractionService {
  constructor(
    private readonly voiceGateway: MadiVoiceGateway,
    private readonly interfaceGateway: ApplicationInterfaceGateway,
  ) {}

  async handle(request: MadiVoiceInteractionRequest): Promise<MadiVoiceInteractionResult> {
    const transcript = await this.voiceGateway.transcribe(request.audio);
    const response = await this.interfaceGateway.handle({
      id: request.eventId,
      type: 'input.received',
      interface: 'voice',
      timestamp: request.timestamp,
      payload: {
        applicationId: request.applicationId,
        content: transcript.text,
        context: request.context,
      },
    });

    if (!this.isInteractionResponse(response)) {
      throw new Error('La interfaz no devolvió una respuesta de interacción.');
    }

    const text = this.responseText(response);
    const speech = text ? await this.voiceGateway.synthesize({ text, language: transcript.language }) : undefined;

    return { transcript, response, speech };
  }

  private isInteractionResponse(value: unknown): value is MadiInteractionResponse {
    return !!value && typeof value === 'object' && 'status' in value && 'requestId' in value;
  }

  private responseText(response: MadiInteractionResponse): string {
    const candidates = [response.conclusions, response.recommendations, response.proposedActions];
    for (const values of candidates) {
      if (!values?.length) continue;
      const first = values[0];
      if (typeof first === 'string') return first;
      if (first !== null && typeof first === 'object' && 'text' in first && typeof (first as { text: unknown }).text === 'string') {
        return (first as { text: string }).text;
      }
    }
    return '';
  }
}
