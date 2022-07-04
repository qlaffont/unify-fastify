import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import { CustomError, BadRequest, Unauthorized, Forbidden, NotFound, TimeOut, InternalServerError, NotImplemented } from 'unify-errors'

const errorHandler = (error: FastifyError, _: FastifyRequest, reply: FastifyReply) => {
  if(error instanceof CustomError) {
    const response = (error as CustomError).context || '';
    let httpCode: number = 0;

    switch(error.constructor) {
      case BadRequest: {
        httpCode=400
        break;
      }
      case Unauthorized: {
        httpCode=401
        break;
      }
      case Forbidden: {
        httpCode=403
        break;
      }
      case NotFound: {
        httpCode=404
        break;
      }
      case TimeOut: {
        httpCode=408
        break;
      }
      case InternalServerError: {
        httpCode=500
        break;
      }
      case NotImplemented: {
        httpCode=501
        break;
      }
      default: {
        httpCode=500
        break;
      }
    }

    reply.status(httpCode).send(response)
  } else {
    reply.status(500).send({ error: 'An unexpected error occured'})
  }
}

export default errorHandler
