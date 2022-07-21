import fastify from 'fastify';
import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
  NotImplemented,
  TimeOut,
  Unauthorized,
} from 'unify-errors';

import unifyFastify from '../src';

////////////////////////////////////////
// Setup

const server = fastify();
server.register(unifyFastify);

server.get('/ping', async () => {
  return 'pong\n';
});

////////////////////////////////////////
// Test error routes

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

////////////////////////////////////////

const config = {
  port: 8080,
};

server.listen(config, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
