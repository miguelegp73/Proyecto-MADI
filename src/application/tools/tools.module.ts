import { Module } from '@nestjs/common';
import { DefaultAuthorizationPolicy } from '../authorization/default.authorization.policy';
import { BasicVerifier } from '../verification/basic.verifier';
import { MadiToolRegistry } from '../../core/tools/tool.registry';
import { RegistryToolExecutor } from '../../core/tools/tool.executor';
import { BoundedAgentToolLoop } from './bounded.agent.loop';

export const MADI_TOOL_REGISTRY = Symbol('MADI_TOOL_REGISTRY');
export const MADI_TOOL_EXECUTOR = Symbol('MADI_TOOL_EXECUTOR');
export const MADI_AGENT_TOOL_LOOP = Symbol('MADI_AGENT_TOOL_LOOP');

@Module({
  providers: [
    DefaultAuthorizationPolicy,
    BasicVerifier,
    { provide: MADI_TOOL_REGISTRY, useFactory: () => new MadiToolRegistry() },
    {
      provide: MADI_TOOL_EXECUTOR,
      useFactory: (registry: MadiToolRegistry, authorization: DefaultAuthorizationPolicy) =>
        new RegistryToolExecutor(registry, authorization),
      inject: [MADI_TOOL_REGISTRY, DefaultAuthorizationPolicy],
    },
    {
      provide: MADI_AGENT_TOOL_LOOP,
      useFactory: (executor: RegistryToolExecutor, verifier: BasicVerifier) =>
        new BoundedAgentToolLoop(executor, verifier),
      inject: [MADI_TOOL_EXECUTOR, BasicVerifier],
    },
  ],
  exports: [MADI_TOOL_REGISTRY, MADI_TOOL_EXECUTOR, MADI_AGENT_TOOL_LOOP],
})
export class ToolsModule {}
