import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('M.A.D.I. HTTP API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns the expected contract', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({
        status: 'ok',
        service: 'madi',
        version: '0.1.0',
      });
  });

  it('POST /interactions processes a natural greeting through the current pipeline', () => {
    return request(app.getHttpServer())
      .post('/interactions')
      .send({
        requestId: 'e2e-request-001',
        timestamp: '2026-09-12T16:00:00.000Z',
        source: {
          applicationId: 'e2e-test',
          interface: 'text',
        },
        input: {
          type: 'text',
          content: 'Hola M.A.D.I.',
        },
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.requestId).toBe('e2e-request-001');
        expect(response.body.status).toBe('completed');
        expect(response.body.intent.name).toBe('conversation.greeting');
        expect(response.body.responseText).toBe('¡Hola! ¿En qué puedo ayudarte?');
      });
  });

  it('POST /interactions rejects an invalid request', () => {
    return request(app.getHttpServer())
      .post('/interactions')
      .send({
        requestId: '',
      })
      .expect(400);
  });
});
