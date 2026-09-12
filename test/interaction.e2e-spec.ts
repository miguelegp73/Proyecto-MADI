import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('M.A.D.I. interaction (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('executes the safe status capability through the HTTP boundary', async () => {
    const response = await request(app.getHttpServer())
      .post('/interactions')
      .send({
        requestId: 'e2e-status-001',
        timestamp: '2026-09-12T19:00:00.000Z',
        source: {
          applicationId: 'e2e-test',
          interface: 'text',
        },
        input: {
          type: 'text',
          content: '¿Cuál es el estado de M.A.D.I.?',
        },
      })
      .expect(201);

    expect(response.body.status).toBe('completed');
    expect(response.body.intent.name).toBe('information.madi.status');
    expect(response.body.execution).toHaveLength(1);
    expect(response.body.execution[0].capabilityId).toBe('madi.status');
    expect(response.body.execution[0].verification.verified).toBe(true);
    expect(response.body.execution[0].result.output.status).toBe('operational');
  });
});
