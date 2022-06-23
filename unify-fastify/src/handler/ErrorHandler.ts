import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import { CustomError, BadRequest, Unauthorized, Forbidden, NotFound, TimeOut, InternalServerError, NotImplemented } from 'unify-errors'

const errorHandler = (error: FastifyError, _: FastifyRequest, reply: FastifyReply) => {
  if(error instanceof CustomError) {
    let httpCode: number=0, message: any = {}

    switch(error.constructor) {
      case BadRequest: {
        httpCode=400
        message={msg: "That's bad request"}
        break;
      }
      case Unauthorized: {
        httpCode=401
        message={msg: "That's unauthorized"}
        break;
      }
      case Forbidden: {
        httpCode=403
        message={msg: "That's forbidden"}
        break;
      }
      case NotFound: {
        httpCode=404
        message={msg: "That's not found"}
        break;
      }
      case TimeOut: {
        httpCode=408
        message={msg: "That's time out"}
        break;
      }
      case InternalServerError: {
        httpCode=500
        message={msg: "That's intrenal server error"}
        break;
      }
      case NotImplemented: {
        httpCode=501
        message={msg: "That's not implemented"}
        break;
      }
      default: {
        httpCode=500
        message={msg: "Custom error not handled"}
        break;
      }
    }

    console.error('Custom error handled: ', error)
    reply.status(httpCode).send(message)
  } else {
    console.error('Unhandled error', error)
    reply.status(500).send({ error: 'An unexpected error occured'})
  }
}

export default errorHandler
