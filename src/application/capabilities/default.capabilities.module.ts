import { Module } from '@nestjs/common';
import { MadiCapabilityRegistry } from '../../core/capabilities/capability.registry';
import { RegistryCapabilityExecutor } from '../../core/capabilities/capability.executor';
import { MadiStatusCapability } from '../../core/capabilities/madi.status.capability';

export const MADI_CAPABILITY_REGISTRY = Symbol('MADI_CAPABILITY_REGISTRY');
export const MADI_CAPABILITY_EXECUTOR = Symbol('MADI_CAPABILITY_EXECUTOR');

@Module({
  providers: [
    {
      provide: MADI_CAPABILITY_REGISTRY,
      useFactory: () => {
        const registry = new MadiCapabilityRegistry();
        registry.register(new MadiStatusCapability());
        return registry;
      },
    },
    {
      provide: MADI_CAPABILITY_EXECUTOR,
      useFactory: (registry: MadiCapabilityRegistry) =>
        new RegistryCapabilityExecutor(registry),
      inject: [MADI_CAPABILITY_REGISTRY],
    },
  ],
  exports: [MADI_CAPABILITY_REGISTRY, MADI_CAPABILITY_EXECUTOR],
})
export class DefaultCapabilitiesModule {}
