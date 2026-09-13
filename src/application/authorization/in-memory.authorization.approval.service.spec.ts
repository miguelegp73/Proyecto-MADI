import { InMemoryAuthorizationApprovalService } from './in-memory.authorization.approval.service';

describe('InMemoryAuthorizationApprovalService', () => {
  it('requires the same session to approve', async () => {
    const service = new InMemoryAuthorizationApprovalService();
    const approval = await service.create({ sessionId: 's1', capabilityId: 'system.open-url', operation: 'execute' });
    expect(await service.approve(approval.approvalId, 'wrong')).toBe(false);
    expect(await service.approve(approval.approvalId, 's1')).toBe(true);
  });

  it('consumes an approved token only once and only for its operation', async () => {
    const service = new InMemoryAuthorizationApprovalService();
    const approval = await service.create({ sessionId: 's1', capabilityId: 'system.open-url', operation: 'execute' });
    await service.approve(approval.approvalId, 's1');
    expect(await service.validateAndConsume(approval.approvalId, 'other', 'execute')).toBe(false);
    expect(await service.validateAndConsume(approval.approvalId, 'system.open-url', 'execute')).toBe(true);
    expect(await service.validateAndConsume(approval.approvalId, 'system.open-url', 'execute')).toBe(false);
  });
});
