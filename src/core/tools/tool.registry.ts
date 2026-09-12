import { MadiTool } from './tool.contract';

/** Registry for provider-neutral tools. Registration is explicit; no tool is discovered or executed implicitly. */
export class MadiToolRegistry {
  private readonly tools = new Map<string, MadiTool>();

  register(tool: MadiTool): void {
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
