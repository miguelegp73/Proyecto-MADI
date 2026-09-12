import { MadiContext, MadiContextManager } from '../../core/context/context.contract';

export class DefaultContextManager implements MadiContextManager {
  async build(requestContext?: Record<string, unknown>): Promise<MadiContext> {
    return {
      values: requestContext ?? {},
    };
  }
}
