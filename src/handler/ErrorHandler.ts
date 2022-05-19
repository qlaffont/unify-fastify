import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'

const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  console.error('error', error)

  reply.status(409).send({ ok: false })
}

export default errorHandler
