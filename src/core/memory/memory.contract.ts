export type MadiMemoryKind = 'interaction' | 'fact' | 'note';

export interface MadiMemoryEntry {
  id: string;
  scope: string;
  kind: MadiMemoryKind;
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface MadiMemoryStore {
  remember(entry: MadiMemoryEntry): Promise<void>;
  recall(scope: string, limit?: number): Promise<MadiMemoryEntry[]>;
}
