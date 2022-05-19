import fastify from 'fastify'
import { BadRequest } from 'unify-errors';
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
  throw BadRequest({ example: 'A bad request error'})
})

////////////////////////////////////////

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
