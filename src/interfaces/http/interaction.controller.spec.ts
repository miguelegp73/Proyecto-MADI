import { BadRequestException } from '@nestjs/common';
import { InteractionController } from './interaction.controller';
import { InteractionService } from '../../application/interaction/interaction.service';
import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';
import { MadiOrchestrator } from '../../application/orchestration/madi.orchestrator';

describe('InteractionController', () => {
  const orchestrator = {
    execute: jest.fn().mockResolvedValue({
      requestId: 'test-request-002',
      timestamp: '2026-09-12T16:00:00.000Z',
      status: 'completed',
    }),
  } as unknown as MadiOrchestrator;
  const service = new InteractionService(orchestrator);
  const controller = new InteractionController(service);

  const validRequest: MadiInteractionRequest = {
    requestId: 'test-request-002',
    timestamp: '2026-09-12T16:00:00.000Z',
    source: {
      applicationId: 'test-app',
      interface: 'text',
    },
    input: {
      type: 'text',
      content: 'Analiza esta información.',
    },
  };

  it('accepts a valid interaction request', async () => {
    await expect(controller.handle(validRequest)).resolves.toMatchObject({
      requestId: 'test-request-002',
      status: 'completed',
    });
  });

  it('rejects a request without requestId', () => {
    expect(() =>
      controller.handle({
        ...validRequest,
        requestId: '',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects an unsupported input type', () => {
    expect(() =>
      controller.handle({
        ...validRequest,
        input: {
          type: 'unsupported' as MadiInteractionRequest['input']['type'],
          content: 'test',
        },
      }),
    ).toThrow(BadRequestException);
  });
});
