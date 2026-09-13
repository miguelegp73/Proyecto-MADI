import { BadRequestException, Body, Controller, Inject, Post } from '@nestjs/common';
import { MadiAuthorizationApprovalService } from '../../core/authorization/authorization.approval.contract';
import { InMemoryAuthorizationApprovalService } from '../../application/authorization/in-memory.authorization.approval.service';

@Controller('madi/auth')
export class MadiAuthorizationController {
  constructor(@Inject(InMemoryAuthorizationApprovalService) private readonly approvals: MadiAuthorizationApprovalService) {}

  @Post('approve')
  async approve(@Body() body: { approvalId?: string; sessionId?: string }) {
    if (!body?.approvalId || !body?.sessionId) throw new BadRequestException('approvalId y sessionId son obligatorios.');
    const approved = await this.approvals.approve(body.approvalId, body.sessionId);
    return { approved, authorizationToken: approved ? body.approvalId : undefined };
  }
}
