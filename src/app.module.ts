import { Module } from '@nestjs/common';
import { InteractionModule } from './application/interaction/interaction.module';
import { HealthModule } from './core/health/health.module';

@Module({
  imports: [HealthModule, InteractionModule],
})
export class AppModule {}
