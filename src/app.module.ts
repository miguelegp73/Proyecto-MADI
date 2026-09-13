import { Module } from '@nestjs/common';
import { InteractionModule } from './application/interaction/interaction.module';
import { ToolsModule } from './application/tools/tools.module';
import { HealthModule } from './core/health/health.module';
import { AuthenticationModule } from './application/authentication/authentication.module';

@Module({
  imports: [HealthModule, InteractionModule, ToolsModule, AuthenticationModule],
})
export class AppModule {}
