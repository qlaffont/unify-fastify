import fastify from 'fastify'
import { BadRequest, Forbidden, Unauthorized, InternalServerError, NotFound, NotImplemented, TimeOut } from 'unify-errors';
import errorHandler from './handler/ErrorHandler';

////////////////////////////////////////
// Setup

const server = fastify()
server.setErrorHandler(errorHandler)

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

////////////////////////////////////////
// Test error routes

server.get('/bad-request', async (request, reply) => {
  throw new BadRequest({ example: 'A bad request error'})
})

server.get('/unauthorized', async (request, reply) => {
  throw new Unauthorized({ example: 'An unauthorized error'})
})

server.get('/forbidden', async (request, reply) => {
  throw new Forbidden({ example: 'A forbidden error'})
})

server.get('/not-found', async (request, reply) => {
  throw new NotFound({ example: 'A not found error'})
})

server.get('/request-time-out', async (request, reply) => {
  throw new TimeOut({ example: 'A request time out error'})
})

server.get('/internal', async (request, reply) => {
  throw new InternalServerError({ example: 'An internal server error'})
})

server.get('/not-implemented', async (request, reply) => {
  throw new NotImplemented({ example: 'A not implemented error'})
})

server.get('/not-custom', async (request, reply) => {
  throw new Error('A generic, not customized error')
})

////////////////////////////////////////

const config = {
  port: 8080,
}

server.listen(config, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
