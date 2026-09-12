import { MadiAuthorizationPolicy } from '../authorization/authorization.contract';
import { MadiTool } from './tool.contract';
import { MadiToolRegistry } from './tool.registry';
import { RegistryToolExecutor } from './tool.executor';

describe('RegistryToolExecutor', () => {
  const createTool = (risk: MadiTool['risk'] = 'low'): MadiTool => ({
    id: 'test.tool',
    name: 'Test tool',
    description: 'Herramienta de prueba.',
    risk,
    operations: ['execute'],
    async execute() {
      return { success: true, output: 'ok' };
    },
  });

  const createPolicy = (decision: 'allowed' | 'denied' | 'required'): MadiAuthorizationPolicy => ({
    async authorize() {
      return { decision };
    },
  });

  const executorFor = (tool: MadiTool, decision: 'allowed' | 'denied' | 'required' = 'allowed') => {
    const registry = new MadiToolRegistry();
    registry.register(tool);
    return new RegistryToolExecutor(registry, createPolicy(decision));
  };

  it('ejecuta únicamente herramientas registradas', async () => {
    const executor = executorFor(createTool());

    await expect(executor.execute({ toolId: 'missing.tool', operation: 'execute' })).resolves.toEqual({
      success: false,
      error: {
        code: 'TOOL_NOT_FOUND',
        message: "La herramienta 'missing.tool' no está registrada.",
      },
    });
  });

  it('bloquea operaciones no declaradas por la herramienta', async () => {
    const executor = executorFor(createTool());

    await expect(executor.execute({ toolId: 'test.tool', operation: 'delete' })).resolves.toEqual({
      success: false,
      error: {
        code: 'TOOL_OPERATION_NOT_ALLOWED',
        message: "La operación 'delete' no está permitida para la herramienta 'test.tool'.",
      },
    });
  });

  it('exige autorización cuando la política la requiere', async () => {
    const executor = executorFor(createTool('moderate'), 'required');

    await expect(executor.execute({ toolId: 'test.tool', operation: 'execute' })).resolves.toEqual({
      success: false,
      error: {
        code: 'TOOL_AUTHORIZATION_REQUIRED',
        message: 'La operación requiere autorización.',
      },
    });
  });

  it('bloquea una autorización denegada', async () => {
    const executor = executorFor(createTool('high'), 'denied');

    await expect(executor.execute({ toolId: 'test.tool', operation: 'execute' })).resolves.toEqual({
      success: false,
      error: {
        code: 'TOOL_AUTHORIZATION_DENIED',
        message: 'La operación requiere autorización.',
      },
    });
  });

  it('no deja escapar excepciones de una herramienta', async () => {
    const tool = createTool();
    tool.execute = async () => {
      throw new Error('fallo controlado');
    };
    const executor = executorFor(tool);

    await expect(executor.execute({ toolId: 'test.tool', operation: 'execute' })).resolves.toEqual({
      success: false,
      error: {
        code: 'TOOL_EXECUTION_ERROR',
        message: 'fallo controlado',
      },
    });
  });

  it('rechaza resultados de herramienta malformados', async () => {
    const tool = createTool();
    tool.execute = async () => ({ success: 'yes' } as unknown as { success: boolean });
    const executor = executorFor(tool);

    await expect(executor.execute({ toolId: 'test.tool', operation: 'execute' })).resolves.toEqual({
      success: false,
      error: {
        code: 'INVALID_TOOL_RESULT',
        message: 'La herramienta devolvió un resultado inválido.',
      },
    });
  });
});
