import { beforeEach, describe, expect, it } from '@jest/globals';
import { FastifyInstance } from 'fastify';

import makeServer from './core/Server';

let server: FastifyInstance

const testRoute = async (server: FastifyInstance, routePath: string, supposedMessage: string, supposedStatus: number) => {
  const response = await server.inject({
    method: 'GET',
    url: routePath
  })

  expect(JSON.parse(response.body).msg).toBe(supposedMessage);
  expect(response.statusCode).toBe(supposedStatus);
}

////////////////////

beforeEach(() => {
  server = makeServer();
})

describe('errorPlugin', () => {
  it('bad request', async () => {
    await testRoute(server, '/bad-request', "That's bad request", 400)
  });
});
