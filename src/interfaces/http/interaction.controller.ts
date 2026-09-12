import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { InteractionService } from '../../application/interaction/interaction.service';
import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';

@Controller('interactions')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  handle(@Body() request: MadiInteractionRequest) {
    this.validate(request);
    return this.interactionService.execute(request);
  }

  private validate(request: MadiInteractionRequest): void {
    if (!request || typeof request !== 'object') {
      throw new BadRequestException('La solicitud de M.A.D.I. es obligatoria.');
    }

    if (!request.requestId || typeof request.requestId !== 'string') {
      throw new BadRequestException('requestId es obligatorio.');
    }

    if (!request.timestamp || typeof request.timestamp !== 'string') {
      throw new BadRequestException('timestamp es obligatorio.');
    }

    if (!request.source || typeof request.source.applicationId !== 'string') {
      throw new BadRequestException('source.applicationId es obligatorio.');
    }

    if (!request.source.interface || typeof request.source.interface !== 'string') {
      throw new BadRequestException('source.interface es obligatorio.');
    }

    if (!request.input || typeof request.input.content !== 'string') {
      throw new BadRequestException('input.content es obligatorio.');
    }

    if (!['text', 'voice', 'structured'].includes(request.input.type)) {
      throw new BadRequestException('input.type no es válido.');
    }
  }
}
