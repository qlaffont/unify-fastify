import { beforeEach, describe, expect, it } from '@jest/globals';
import { FastifyInstance } from 'fastify';

import makeServer from './core/Server';

let server: FastifyInstance;

const testRoute = async (
  server: FastifyInstance,
  routePath: string,
  supposedMessage: Record<string, unknown>,
  supposedStatus: number
) => {
  const response = await server.inject({
    method: 'GET',
    url: routePath,
  });

  expect(JSON.parse(response.body)).toStrictEqual(supposedMessage);
  expect(response.statusCode).toBe(supposedStatus);
};

////////////////////

beforeEach(() => {
  server = makeServer();
});

describe('errorPlugin', () => {
  it('bad request', async () => {
    await testRoute(
      server,
      '/bad-request',
      { example: 'A bad request error' },
      400
    );
  });

  it('unauthorized', async () => {
    await testRoute(
      server,
      '/unauthorized',
      { example: 'An unauthorized error' },
      401
    );
  });

  it('forbidden', async () => {
    await testRoute(
      server,
      '/forbidden',
      { example: 'A forbidden error' },
      403
    );
  });

  it('not-found', async () => {
    await testRoute(
      server,
      '/not-found',
      { example: 'A not found error' },
      404
    );
  });

  it('time-out', async () => {
    await testRoute(
      server,
      '/request-time-out',
      { example: 'A request time out error' },
      408
    );
  });

  it('internal', async () => {
    await testRoute(
      server,
      '/internal',
      { example: 'An internal server error' },
      500
    );
  });

  it('not-implemented', async () => {
    await testRoute(
      server,
      '/not-implemented',
      { example: 'A not implemented error' },
      501
    );
  });

  it("error not extending 'CustomError' from 'unify-errors'", async () => {
    await testRoute(
      server,
      '/not-custom',
      { error: 'An unexpected error occured' },
      500
    );
  });
});
