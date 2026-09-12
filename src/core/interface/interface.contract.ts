export type MadiInterfaceType = 'text' | 'voice' | 'desktop' | 'web';

export type MadiInterfaceEventType = 'input.started' | 'input.received' | 'response.started' | 'response.delta' | 'response.completed' | 'error';

export interface MadiInterfaceEvent {
  id: string;
  type: MadiInterfaceEventType;
  interface: MadiInterfaceType;
  timestamp: string;
  payload?: unknown;
}

/** Stable boundary for future text, voice and desktop interfaces. */
export interface MadiInterfaceGateway {
  handle(event: MadiInterfaceEvent): Promise<unknown>;
}
