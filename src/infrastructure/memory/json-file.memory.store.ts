import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { MadiMemoryEntry, MadiMemoryStore } from '../../core/memory/memory.contract';

/** Persistent local memory for v0.1. It stores only M.A.D.I. memory entries, never credentials. */
export class JsonFileMemoryStore implements MadiMemoryStore {
  private readonly filePath: string;
  private entries: MadiMemoryEntry[] = [];
  private loaded = false;
  private writeChain: Promise<void> = Promise.resolve();

  constructor(filePath = process.env.MADI_MEMORY_FILE ?? '.data/madi-memory.json') {
    this.filePath = filePath;
  }

  async remember(entry: MadiMemoryEntry): Promise<void> {
    await this.load();
    this.entries.push({ ...entry });
    await this.persist();
  }

  async recall(scope: string, limit = 10): Promise<MadiMemoryEntry[]> {
    if (limit <= 0) return [];
    await this.load();
    return this.entries
      .filter((entry) => entry.scope === scope)
      .slice(-limit)
      .reverse()
      .map((entry) => ({ ...entry }));
  }

  private async load(): Promise<void> {
    if (this.loaded) return;

    try {
      const raw = await readFile(this.filePath, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        throw new Error('El archivo de memoria no contiene una lista válida.');
      }
      this.entries = parsed as MadiMemoryEntry[];
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error
        ? (error as { code?: string }).code
        : undefined;
      if (code !== 'ENOENT') throw error;
      this.entries = [];
    }

    this.loaded = true;
  }

  private persist(): Promise<void> {
    const snapshot = JSON.stringify(this.entries, null, 2) + '\n';
    this.writeChain = this.writeChain.then(async () => {
      await mkdir(dirname(this.filePath), { recursive: true });
      const tempPath = `${this.filePath}.tmp`;
      await writeFile(tempPath, snapshot, 'utf8');
      await rename(tempPath, this.filePath);
    });
    return this.writeChain;
  }
}
