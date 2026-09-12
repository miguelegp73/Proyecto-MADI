import { MadiTool } from './tool.contract';
import { MadiToolRegistry } from './tool.registry';

describe('MadiToolRegistry', () => {
  const tool: MadiTool = {
    id: 'test.tool',
    name: 'Test tool',
    description: 'Herramienta de prueba.',
    risk: 'low',
    async execute() {
      return { success: true, output: 'ok' };
    },
  };

  it('registra y recupera herramientas explícitamente', () => {
    const registry = new MadiToolRegistry();

    registry.register(tool);

    expect(registry.get('test.tool')).toBe(tool);
    expect(registry.list()).toEqual([tool]);
  });

  it('rechaza identificadores duplicados', () => {
    const registry = new MadiToolRegistry();
    registry.register(tool);

    expect(() => registry.register(tool)).toThrow("La herramienta 'test.tool' ya está registrada.");
  });

  it('no inventa herramientas no registradas', () => {
    const registry = new MadiToolRegistry();

    expect(registry.get('missing.tool')).toBeUndefined();
    expect(registry.list()).toEqual([]);
  });
});
