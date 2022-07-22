import { beforeEach, describe, expect, it } from '@jest/globals';
import { FastifyInstance } from 'fastify';

import makeServer from './core/Server';

let server: FastifyInstance;

const testRoute = async (
  server: FastifyInstance,
  routePath: string,
  supposedMessage: Record<string, unknown>,
  supposedStatus: number
): Promise<void> => {
  const response = await server.inject({
    method: 'GET',
    url: routePath,
  });

  expect(JSON.parse(response.body)).toStrictEqual(supposedMessage);
  expect(response.statusCode).toBe(supposedStatus);
};

////////////////////

describe('errors rejection', () => {
  beforeEach(() => {
    server = makeServer();
  });

  it('bad request', async () => {
    await testRoute(
      server,
      '/bad-request',
      {
        error: 'BadRequest',
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
        error: 'NotFound',
        context: { example: 'A not found error' },
      },
      404
    );
  });

  it('time-out', async () => {
    await testRoute(
      server,
      '/request-time-out',
      {
        error: 'TimeOut',
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
        error: 'InternalServerError',
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
        error: 'NotImplemented',
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
        error: 'DefaultError',
        context: { example: 'A CustomError but not handled' },
      },
      500
    );
  });
});

describe('plugin options', () => {
  describe("'hideContextOnProd'", () => {
    describe('in a production environnement', () => {
      it("by default, should not hide 'context'", async () => {
        process.env.NODE_ENV = 'production';

        const server = makeServer();

        await testRoute(
          server,
          '/bad-request',
          {
            error: 'BadRequest',
            context: { example: 'A bad request error' },
          },
          400
        );
      });

      it("should hide 'context' key if true", async () => {
        process.env.NODE_ENV = 'production';

        const server = makeServer({ hideContextOnProd: true });

        await testRoute(
          server,
          '/bad-request',
          {
            error: 'BadRequest',
          },
          400
        );
      });

      it("should not hide 'context' key if false", async () => {
        process.env.NODE_ENV = 'production';

        const server = makeServer({ hideContextOnProd: false });

        await testRoute(
          server,
          '/bad-request',
          {
            error: 'BadRequest',
            context: { example: 'A bad request error' },
          },
          400
        );
      });
    });
  });

  describe('NOT in a production environnement', () => {
    it("by default, should not hide 'context' key", async () => {
      const server = makeServer();

      await testRoute(
        server,
        '/bad-request',
        {
          error: 'BadRequest',
          context: { example: 'A bad request error' },
        },
        400
      );
    });

    it("should hide 'context' key if true", async () => {
      const server = makeServer({ hideContextOnProd: true });

      await testRoute(
        server,
        '/bad-request',
        {
          error: 'BadRequest',
        },
        400
      );
    });

    it("should not hide 'context' key if false", async () => {
      const server = makeServer({ hideContextOnProd: false });

      await testRoute(
        server,
        '/bad-request',
        {
          error: 'BadRequest',
          context: { example: 'A bad request error' },
        },
        400
      );
    });
  });
});
