import { MadiToolResult } from '../../core/tools/tool.contract';
import { MadiToolExecutor } from '../../core/tools/tool.executor';
import { MadiVerifier } from '../../core/verification/verification.contract';
import { BoundedAgentToolLoop } from './bounded.agent.loop';

const result = (output: unknown): MadiToolResult => ({ success: true, output });

function make(execute: MadiToolExecutor['execute'], verify: MadiVerifier['verify']) {
  return new BoundedAgentToolLoop({ execute }, { verify });
}

describe('BoundedAgentToolLoop', () => {
  it('executes a finite sequence and verifies every result', async () => {
    const execute = jest.fn()
      .mockResolvedValueOnce(result('one'))
      .mockResolvedValueOnce(result('two'));
    const verify = jest.fn().mockResolvedValue({ verified: true });
    const loop = make(execute, verify);

    const response = await loop.run({
      actions: [
        { id: 'a1', toolId: 'tool.test', operation: 'one' },
        { id: 'a2', toolId: 'tool.test', operation: 'two' },
      ],
    });

    expect(response.status).toBe('completed');
    expect(response.stepsExecuted).toBe(2);
    expect(response.trace.every((entry) => entry.status === 'verified')).toBe(true);
    expect(execute).toHaveBeenCalledTimes(2);
    expect(verify).toHaveBeenCalledTimes(2);
  });

  it('stops at the configured step limit', async () => {
    const execute = jest.fn().mockResolvedValue(result('ok'));
    const verify = jest.fn().mockResolvedValue({ verified: true });
    const loop = make(execute, verify);

    const response = await loop.run({
      maxSteps: 1,
      actions: [
        { id: 'a1', toolId: 'tool.test', operation: 'one' },
        { id: 'a2', toolId: 'tool.test', operation: 'two' },
      ],
    });

    expect(response.status).toBe('limit_reached');
    expect(response.stepsExecuted).toBe(1);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('detects repeated actions before executing them again', async () => {
    const execute = jest.fn().mockResolvedValue(result('ok'));
    const verify = jest.fn().mockResolvedValue({ verified: true });
    const loop = make(execute, verify);

    const response = await loop.run({
      actions: [
        { id: 'a1', toolId: 'tool.test', operation: 'read', input: { b: 2, a: 1 } },
        { id: 'a2', toolId: 'tool.test', operation: 'read', input: { a: 1, b: 2 } },
      ],
    });

    expect(response.status).toBe('cycle_detected');
    expect(response.stepsExecuted).toBe(1);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('stops when authorization is required', async () => {
    const execute = jest.fn().mockResolvedValue({
      success: false,
      error: { code: 'TOOL_AUTHORIZATION_REQUIRED', message: 'authorization required' },
    });
    const verify = jest.fn();
    const loop = make(execute, verify);

    const response = await loop.run({
      actions: [{ id: 'a1', toolId: 'tool.test', operation: 'write' }],
    });

    expect(response.status).toBe('needs_authorization');
    expect(response.trace[0].status).toBe('blocked');
    expect(verify).not.toHaveBeenCalled();
  });

  it('stops when verification fails', async () => {
    const execute = jest.fn().mockResolvedValue(result('actual'));
    const verify = jest.fn().mockResolvedValue({ verified: false, reason: 'mismatch' });
    const loop = make(execute, verify);

    const response = await loop.run({
      actions: [{ id: 'a1', toolId: 'tool.test', operation: 'read', expected: 'expected' }],
    });

    expect(response.status).toBe('failed');
    expect(response.trace[0].status).toBe('failed');
    expect(response.error?.code).toBe('AGENT_RESULT_NOT_VERIFIED');
  });
});
