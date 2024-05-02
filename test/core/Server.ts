import fastify from 'fastify';
import { fastifyAuthPrismaPlugin } from 'fastify-auth-prisma';
import {
  BadRequest,
  CustomError,
  CustomErrorContext,
  Forbidden,
  InternalServerError,
  NotFound,
  NotImplemented,
  TimeOut,
  TooManyRequests,
  Unauthorized,
} from 'unify-errors';

import errorPlugin, { Options } from '../../src';

export class DefaultError extends CustomError {
  constructor(public context?: CustomErrorContext) {
    super('A default error', context);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DefaultError.prototype);
  }
}

const makeServer = async (options?: Options) => {
  const server = fastify();

  await server.register(errorPlugin, options);

  server.get('/bad-request', async () => {
    throw new BadRequest({ example: 'A bad request error' });
  });

  server.get('/unauthorized', async () => {
    throw new Unauthorized({ example: 'An unauthorized error' });
  });

  server.get('/forbidden', async () => {
    throw new Forbidden({ example: 'A forbidden error' });
  });

  server.get('/not-found', async () => {
    throw new NotFound({ example: 'A not found error' });
  });

  server.get('/request-time-out', async () => {
    throw new TimeOut({ example: 'A request time out error' });
  });

  server.get('/internal', async () => {
    throw new InternalServerError({ example: 'An internal server error' });
  });

  server.get('/not-implemented', async () => {
    throw new NotImplemented({ example: 'A not implemented error' });
  });

  server.get('/not-custom', async () => {
    throw new Error('A generic, not customized error');
  });

  server.get('/default-case', async () => {
    throw new DefaultError({ example: 'A CustomError but not handled' });
  });

  server.get('/too-many-requests', async () => {
    throw new TooManyRequests({});
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  await server.register(fastifyAuthPrismaPlugin, {
    config: [
      { url: '/bad-request', method: '*' },
      { url: '/unauthorized', method: '*' },
      { url: '/forbidden', method: '*' },
      { url: '/not-found', method: '*' },
      { url: '/request-time-out', method: '*' },
      { url: '/internal', method: '*' },
      { url: '/not-implemented', method: '*' },
      { url: '/not-custom', method: '*' },
      { url: '/default-case', method: '*' },
      { url: '/too-many-requests', method: '*' },
    ],
    prisma: () => {},
    secret: 'wrongsecret',
  });

  return server;
};

export default makeServer;
