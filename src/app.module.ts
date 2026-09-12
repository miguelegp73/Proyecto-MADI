import { Module } from '@nestjs/common';
import { InteractionModule } from './application/interaction/interaction.module';
import { ToolsModule } from './application/tools/tools.module';
import { HealthModule } from './core/health/health.module';

@Module({
  imports: [HealthModule, InteractionModule, ToolsModule],
})
export class AppModule {}
