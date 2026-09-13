import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonFileMemoryStore } from './json-file.memory.store';

describe('JsonFileMemoryStore', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'madi-memory-'));
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it('persists entries and reloads them in a new store instance', async () => {
    const file = join(directory, 'memory.json');
    const first = new JsonFileMemoryStore(file);

    await first.remember({
      id: '1',
      scope: 'miguel',
      kind: 'fact',
      content: 'Prefiere respuestas directas.',
      timestamp: '2026-09-12T00:00:00.000Z',
    });

    const second = new JsonFileMemoryStore(file);
    await expect(second.recall('miguel')).resolves.toEqual([
      expect.objectContaining({ id: '1', content: 'Prefiere respuestas directas.' }),
    ]);
    await expect(readFile(file, 'utf8')).resolves.toContain('Prefiere respuestas directas.');
  });

  it('returns an empty memory when the file does not exist', async () => {
    const store = new JsonFileMemoryStore(join(directory, 'missing.json'));
    await expect(store.recall('miguel')).resolves.toEqual([]);
  });

  it('rejects invalid persisted JSON', async () => {
    const file = join(directory, 'invalid.json');
    const { writeFile } = await import('node:fs/promises');
    await writeFile(file, '{invalid', 'utf8');

    const store = new JsonFileMemoryStore(file);
    await expect(store.recall('miguel')).rejects.toThrow();
  });
});
