import { beforeEach, describe, expect, it } from '@jest/globals';
import { FastifyInstance } from 'fastify';

import makeServer from './core/Server';

let server: FastifyInstance;

const testRoute = async (
  server: FastifyInstance,
  routePath: string,
  supposedMessage: Record<string, unknown>,
  supposedStatus: number
): Promise<any> => {
  const response = await server.inject({
    method: 'GET',
    url: routePath,
  });

  expect(JSON.parse(response.body)).toMatchObject(supposedMessage);
  expect(response.statusCode).toBe(supposedStatus);

  return response;
};

////////////////////

describe('Fastify loading', () => {
  beforeEach(async () => {
    server = await makeServer();
  });

  it('Check if plugin is loaded', async () => {
    expect(server.printPlugins()).toContain('unify-fastify');
  });
});

describe('errors rejection', () => {
  beforeEach(async () => {
    server = await makeServer();
  });

  it('bad request', async () => {
    await testRoute(
      server,
      '/bad-request',
      {
        error: 'Bad Request',
        context: { example: 'A bad request error' },
      },
      400
    );
  });

  it('unauthorized', async () => {
    await testRoute(
      server,
      '/unauthorized',
      {
        error: 'Unauthorized',
        context: { example: 'An unauthorized error' },
      },
      401
    );
  });

  it('forbidden', async () => {
    await testRoute(
      server,
      '/forbidden',
      {
        error: 'Forbidden',
        context: { example: 'A forbidden error' },
      },
      403
    );
  });

  it('not-found', async () => {
    await testRoute(
      server,
      '/not-found',
      {
        error: 'Not Found',
        context: { example: 'A not found error' },
      },
      404
    );

    await testRoute(
      server,
      '/not-found-url-not-registered',
      {
        error: 'Not Found',
      },
      404
    );
  });

  it('time-out', async () => {
    await testRoute(
      server,
      '/request-time-out',
      {
        error: 'Request Time-out',
        context: { example: 'A request time out error' },
      },
      408
    );
  });

  it('internal', async () => {
    await testRoute(
      server,
      '/internal',
      {
        error: 'Internal Server Error',
        context: { example: 'An internal server error' },
      },
      500
    );
  });

  it('not-implemented', async () => {
    await testRoute(
      server,
      '/not-implemented',
      {
        error: 'Not Implemented',
        context: { example: 'A not implemented error' },
      },
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

  it("default error extending 'CustomError' from 'unify-errors'", async () => {
    await testRoute(
      server,
      '/default-case',
      {
        error: 'A default error',
        context: { example: 'A CustomError but not handled' },
      },
      500
    );
  });
});

describe('plugin options', () => {
  describe("'hideError'", () => {
    it('should hide stack', async () => {
      const server = await makeServer({
        hideError: true,
      });

      const response = await testRoute(
        server,
        '/bad-request',
        {
          error: 'Bad Request',
        },
        400
      );
      expect(JSON.parse(response.body)?.stack).not.toBeDefined();
    });

    it('should not hide stack', async () => {
      const server = await makeServer();

      const response = await testRoute(
        server,
        '/bad-request',
        {
          error: 'Bad Request',
        },
        400
      );
      expect(JSON.parse(response.body)?.stack).toBeDefined();
    });
  });
});
