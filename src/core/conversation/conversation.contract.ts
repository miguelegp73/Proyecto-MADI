export type MadiConversationState = 'new' | 'active' | 'closed';

export interface MadiConversationTurn {
  requestId: string;
  timestamp: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface MadiConversationSession {
  conversationId: string;
  sessionId: string;
  state: MadiConversationState;
  turns: readonly MadiConversationTurn[];
}

export interface MadiConversationManager {
  start(sessionId: string): Promise<MadiConversationSession>;
  get(conversationId: string): Promise<MadiConversationSession | undefined>;
  append(conversationId: string, turn: MadiConversationTurn): Promise<MadiConversationSession>;
  close(conversationId: string): Promise<void>;
}
