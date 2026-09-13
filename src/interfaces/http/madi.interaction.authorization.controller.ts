import { BadRequestException, Body, Controller, Inject, Post } from '@nestjs/common';
import { InteractionService } from '../../application/interaction/interaction.service';
import { MadiInteractionRequest } from '../../core/interaction/interaction.contract';
import { MadiAuthorizationApprovalService } from '../../core/authorization/authorization.approval.contract';
import { InMemoryAuthorizationApprovalService } from '../../application/authorization/in-memory.authorization.approval.service';

@Controller('madi')
export class MadiInteractionAuthorizationController {
  constructor(
    private readonly interactionService: InteractionService,
    @Inject(InMemoryAuthorizationApprovalService) private readonly approvals: MadiAuthorizationApprovalService,
  ) {}

  @Post('interaction')
  async handle(@Body() request: MadiInteractionRequest) {
    if (!request?.requestId || !request?.input?.content) throw new BadRequestException('La interacción de M.A.D.I. es obligatoria.');
    const response = await this.interactionService.execute(request);
    if (response.status !== 'needs_authorization') return response;

    const sessionId = typeof request.metadata?.sessionId === 'string' ? request.metadata.sessionId : undefined;
    const plan = (response as typeof response & { plan?: { steps?: Array<{ capabilityId?: string; operation?: string }> } }).plan;
    const step = plan?.steps?.[0];
    if (!sessionId || !step?.capabilityId) return response;

    const approval = await this.approvals.create({ sessionId, capabilityId: step.capabilityId, operation: step.operation ?? 'execute' });
    return { ...response, authorization: { ...response.authorization, required: true, approvalId: approval.approvalId } };
  }
}
