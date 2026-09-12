import { MadiReasoningInput, MadiReasoningResult } from '../../core/reasoning/reasoning.engine';
import { MadiReasoningProvider } from '../../core/reasoning/reasoning.provider';
import { BasicReasoningEngine } from '../../application/reasoning/basic.reasoning.engine';

/** Local provider wrapper. Keeps the provider pipeline usable without credentials or network access. */
export class BasicReasoningProvider implements MadiReasoningProvider {
  readonly id = 'basic-local';
  readonly priority = 1000;

  constructor(private readonly engine: BasicReasoningEngine = new BasicReasoningEngine()) {}

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async reason(input: MadiReasoningInput): Promise<MadiReasoningResult> {
    return this.engine.reason(input);
  }
}
