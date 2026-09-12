import { MadiTool } from './tool.contract';
import { MadiToolRegistry } from './tool.registry';

describe('MadiToolRegistry', () => {
  const createTool = (id = 'test.tool'): MadiTool => ({
    id,
    name: 'Test tool',
    description: 'Herramienta de prueba.',
    risk: 'low',
    async execute() {
      return { success: true, output: 'ok' };
    },
  });

  it('registra y recupera herramientas explícitamente', () => {
    const registry = new MadiToolRegistry();
    const tool = createTool();

    registry.register(tool);

    expect(registry.get('test.tool')).toBe(tool);
    expect(registry.list()).toEqual([tool]);
  });

  it('rechaza identificadores duplicados', () => {
    const registry = new MadiToolRegistry();
    registry.register(createTool());

    expect(() => registry.register(createTool())).toThrow(
      "La herramienta 'test.tool' ya está registrada.",
    );
  });

  it('rechaza identificadores vacíos o inválidos', () => {
    const registry = new MadiToolRegistry();

    expect(() => registry.register(createTool(''))).toThrow(
      'El identificador de la herramienta es obligatorio.',
    );
    expect(() => registry.register(createTool('  '))).toThrow(
      'El identificador de la herramienta es obligatorio.',
    );
  });

  it('no permite reemplazar silenciosamente una herramienta existente', () => {
    const registry = new MadiToolRegistry();
    const original = createTool();
    registry.register(original);

    expect(() => registry.register(createTool())).toThrow();
    expect(registry.get('test.tool')).toBe(original);
  });

  it('no inventa herramientas no registradas', () => {
    const registry = new MadiToolRegistry();

    expect(registry.get('missing.tool')).toBeUndefined();
    expect(registry.list()).toEqual([]);
  });
});
