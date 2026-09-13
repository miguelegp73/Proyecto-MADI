import { InteractionService } from './interaction.service';
import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';
import { MadiOrchestrator } from '../orchestration/madi.orchestrator';
import { MadiSessionManager } from '../../core/authentication/session.contract';
import { MadiConversationManager } from '../../core/conversation/conversation.contract';

describe('InteractionService', () => {
  it('delegates the interaction to the orchestrator', async () => {
    const orchestrator = {
      execute: jest.fn().mockResolvedValue({
        requestId: 'test-request-001',
        timestamp: '2026-09-12T16:00:00.000Z',
        status: 'completed',
      }),
    } as unknown as MadiOrchestrator;

    const service = new InteractionService(orchestrator);
    const request: MadiInteractionRequest = {
      requestId: 'test-request-001',
      timestamp: '2026-09-12T16:00:00.000Z',
      source: { applicationId: 'test-app', interface: 'text' },
      input: { type: 'text', content: 'Hola M.A.D.I.' },
    };

    const response = await service.execute(request);

    expect(orchestrator.execute).toHaveBeenCalledWith(request);
    expect(response).toMatchObject({ requestId: 'test-request-001', status: 'completed' });
  });

  it('propagates authenticated session and conversation scope and bounded history', async () => {
    const orchestrator = {
      execute: jest.fn().mockResolvedValue({
        requestId: 'request-002',
        timestamp: '2026-09-12T16:01:00.000Z',
        status: 'completed',
        responseText: 'Entendido.',
      }),
    } as unknown as MadiOrchestrator;

    const sessions: MadiSessionManager = {
      establish: jest.fn(),
      get: jest.fn().mockResolvedValue({
        sessionId: 'session-001',
        state: 'authenticated',
        identity: { userId: 'miguel', displayName: 'Miguel', method: 'credential' },
      }),
      expire: jest.fn(),
    };
    const conversations: MadiConversationManager = {
      start: jest.fn(),
      get: jest.fn().mockResolvedValue({
        conversationId: 'conversation-001',
        sessionId: 'session-001',
        state: 'active',
        turns: [
          { requestId: 'old', timestamp: '2026-09-12T15:00:00.000Z', role: 'user', content: 'Recordá mi nombre.' },
          { requestId: 'old-2', timestamp: '2026-09-12T15:01:00.000Z', role: 'assistant', content: 'Claro.' },
        ],
      }),
      append: jest.fn().mockResolvedValue(undefined),
      close: jest.fn(),
    };

    const service = new InteractionService(orchestrator, undefined, sessions, conversations);
    const request: MadiInteractionRequest = {
      requestId: 'request-002',
      timestamp: '2026-09-12T16:01:00.000Z',
      source: { applicationId: 'test-app', interface: 'text' },
      input: { type: 'text', content: '¿Cuál es mi nombre?' },
      metadata: { sessionId: 'session-001', conversationId: 'conversation-001' },
    };

    await service.execute(request);

    expect(orchestrator.execute).toHaveBeenCalledWith(expect.objectContaining({
      context: expect.objectContaining({
        sessionId: 'session-001',
        conversationId: 'conversation-001',
        conversation: {
          turns: [
            { role: 'user', content: 'Recordá mi nombre.' },
            { role: 'assistant', content: 'Claro.' },
          ],
        },
      }),
    }));
    expect(conversations.append).toHaveBeenCalledTimes(2);
  });
});
