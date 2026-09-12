export interface MadiContext {
  conversationId?: string;
  userId?: string;
  sessionId?: string;
  values: Record<string, unknown>;
  sources?: MadiContextSource[];
}

export interface MadiContextSource {
  sourceId: string;
  type: string;
  freshness?: string;
  reliability?: number;
}

export interface MadiContextManager {
  build(requestContext?: Record<string, unknown>): Promise<MadiContext>;
}
