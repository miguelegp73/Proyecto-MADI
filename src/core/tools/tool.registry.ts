import { MadiTool, MadiToolRisk } from './tool.contract';

const VALID_RISKS: readonly MadiToolRisk[] = ['low', 'moderate', 'high'];

/** Registry for provider-neutral tools. Registration is explicit; no tool is discovered or executed implicitly. */
export class MadiToolRegistry {
  private readonly tools = new Map<string, MadiTool>();

  register(tool: MadiTool): void {
    if (!tool || typeof tool.id !== 'string' || !tool.id.trim()) {
      throw new Error('El identificador de la herramienta es obligatorio.');
    }
    if (typeof tool.name !== 'string' || !tool.name.trim()) {
      throw new Error(`La herramienta '${tool.id}' debe tener un nombre.`);
    }
    if (typeof tool.description !== 'string' || !tool.description.trim()) {
      throw new Error(`La herramienta '${tool.id}' debe tener una descripción.`);
    }
    if (!VALID_RISKS.includes(tool.risk)) {
      throw new Error(`La herramienta '${tool.id}' tiene un nivel de riesgo inválido.`);
    }
    if (typeof tool.execute !== 'function') {
      throw new Error(`La herramienta '${tool.id}' debe definir una función de ejecución.`);
    }
    if (tool.operations?.some((operation) => typeof operation !== 'string' || !operation.trim())) {
      throw new Error(`La herramienta '${tool.id}' contiene una operación inválida.`);
    }
    if (new Set(tool.operations ?? []).size !== (tool.operations ?? []).length) {
      throw new Error(`La herramienta '${tool.id}' contiene operaciones duplicadas.`);
    }

    if (this.tools.has(tool.id)) {
      throw new Error(`La herramienta '${tool.id}' ya está registrada.`);
    }

    this.tools.set(tool.id, tool);
  }

  get(toolId: string): MadiTool | undefined {
    return this.tools.get(toolId);
  }

  list(): MadiTool[] {
    return [...this.tools.values()];
  }
}
