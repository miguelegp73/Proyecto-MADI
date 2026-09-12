import { MadiMemoryEntry, MadiMemoryStore } from '../../core/memory/memory.contract';

export interface MadiMemoryService {
  remember(entry: MadiMemoryEntry): Promise<void>;
  recall(scope: string, limit?: number): Promise<MadiMemoryEntry[]>;
}

export class DefaultMemoryService implements MadiMemoryService {
  constructor(private readonly store: MadiMemoryStore) {}

  remember(entry: MadiMemoryEntry): Promise<void> {
    return this.store.remember(entry);
  }

  recall(scope: string, limit?: number): Promise<MadiMemoryEntry[]> {
    return this.store.recall(scope, limit);
  }
}
