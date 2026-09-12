import { MadiVoiceGateway } from '../../core/voice/voice.contract';
import { ApplicationInterfaceGateway } from '../interface/madi.interface.gateway';
import { VoiceInteractionService } from './voice.interaction.service';

describe('VoiceInteractionService', () => {
  it('transcribes, routes through the interaction boundary, and synthesizes the response', async () => {
    const voiceGateway: MadiVoiceGateway = {
      transcribe: jest.fn().mockResolvedValue({ text: 'Hola', language: 'es-AR', confidence: 0.99 }),
      synthesize: jest.fn().mockResolvedValue({ audioFormat: 'audio/wav', audio: new Uint8Array([1, 2]) }),
    };
    const interfaceGateway = {
      handle: jest.fn().mockResolvedValue({
        requestId: 'voice-1', timestamp: '2026-09-12T00:00:00Z', status: 'completed',
        conclusions: ['Hola, ¿en qué puedo ayudarte?'],
      }),
    } as unknown as ApplicationInterfaceGateway;

    const service = new VoiceInteractionService(voiceGateway, interfaceGateway);
    const response = await service.handle({
      eventId: 'voice-1',
      timestamp: '2026-09-12T00:00:00Z',
      audio: { audioFormat: 'audio/wav', audio: new Uint8Array([3, 4]), language: 'es-AR' },
    });

    expect(response.transcript.text).toBe('Hola');
    expect(interfaceGateway.handle).toHaveBeenCalledWith(expect.objectContaining({ interface: 'voice' }));
    expect(voiceGateway.synthesize).toHaveBeenCalledWith({ text: 'Hola, ¿en qué puedo ayudarte?', language: 'es-AR' });
    expect(response.speech?.audioFormat).toBe('audio/wav');
  });

  it('does not synthesize when the interaction produces no speakable text', async () => {
    const voiceGateway: MadiVoiceGateway = {
      transcribe: jest.fn().mockResolvedValue({ text: 'estado', language: 'es-AR' }),
      synthesize: jest.fn(),
    };
    const interfaceGateway = {
      handle: jest.fn().mockResolvedValue({
        requestId: 'voice-2', timestamp: '2026-09-12T00:00:00Z', status: 'needs_authorization',
      }),
    } as unknown as ApplicationInterfaceGateway;

    const service = new VoiceInteractionService(voiceGateway, interfaceGateway);
    const response = await service.handle({
      eventId: 'voice-2', timestamp: '2026-09-12T00:00:00Z',
      audio: { audioFormat: 'audio/wav', audio: new Uint8Array() },
    });

    expect(response.speech).toBeUndefined();
    expect(voiceGateway.synthesize).not.toHaveBeenCalled();
  });
});
