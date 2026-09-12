import { MadiInteractionResponse } from '../../core/interaction/interaction.contract';
import { InteractionService } from '../interaction/interaction.service';
import { ApplicationInterfaceGateway } from './madi.interface.gateway';

describe('ApplicationInterfaceGateway', () => {
  it('routes text and transcribed voice input through the existing interaction service', async () => {
    const response: MadiInteractionResponse = {
      requestId: 'req-1', timestamp: '2026-09-12T00:00:00Z', status: 'completed',
    };
    const service = { execute: jest.fn().mockResolvedValue(response) } as unknown as InteractionService;
    const gateway = new ApplicationInterfaceGateway(service);

    await expect(gateway.handle({
      id: 'req-1', type: 'input.received', interface: 'voice', timestamp: '2026-09-12T00:00:00Z',
      payload: { content: 'Hola M.A.D.I.' },
    })).resolves.toEqual(response);

    expect(service.execute).toHaveBeenCalledWith(expect.objectContaining({
      requestId: 'req-1',
      input: { type: 'voice', content: 'Hola M.A.D.I.' },
    }));
  });

  it('does not invoke interaction for lifecycle-only events', async () => {
    const service = { execute: jest.fn() } as unknown as InteractionService;
    const gateway = new ApplicationInterfaceGateway(service);
    await expect(gateway.handle({
      id: 'evt-1', type: 'input.started', interface: 'voice', timestamp: '2026-09-12T00:00:00Z',
    })).resolves.toEqual({ accepted: true });
    expect(service.execute).not.toHaveBeenCalled();
  });

  it('rejects input events without content', async () => {
    const service = { execute: jest.fn() } as unknown as InteractionService;
    const gateway = new ApplicationInterfaceGateway(service);
    await expect(gateway.handle({
      id: 'evt-2', type: 'input.received', interface: 'voice', timestamp: '2026-09-12T00:00:00Z', payload: {},
    })).rejects.toThrow('payload.content');
  });
});
