import { MadiMemoryEntry, MadiMemoryStore } from '../../core/memory/memory.contract';

export class InMemoryMemoryStore implements MadiMemoryStore {
  private readonly entries: MadiMemoryEntry[] = [];

  async remember(entry: MadiMemoryEntry): Promise<void> {
    this.entries.push({ ...entry });
  }

  async recall(scope: string, limit = 10): Promise<MadiMemoryEntry[]> {
    if (limit <= 0) {
      return [];
    }

    return this.entries
      .filter((entry) => entry.scope === scope)
      .slice(-limit)
      .reverse()
      .map((entry) => ({ ...entry }));
  }
}
