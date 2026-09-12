import { Module } from '@nestjs/common';
import { MadiCapabilityRegistry } from './capability.registry';
import { RegistryCapabilityExecutor } from './capability.executor';

@Module({
  providers: [MadiCapabilityRegistry, RegistryCapabilityExecutor],
  exports: [MadiCapabilityRegistry, RegistryCapabilityExecutor],
})
export class CapabilityModule {}
