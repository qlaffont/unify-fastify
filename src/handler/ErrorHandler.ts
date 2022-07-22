import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import {
  BadRequest,
  CustomError,
  Forbidden,
  InternalServerError,
  NotFound,
  NotImplemented,
  TimeOut,
  Unauthorized,
} from 'unify-errors';

const errorHandler = (
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply
): void => {
  if (error instanceof CustomError) {
    let httpCode = 0;

    switch (error.constructor) {
      case BadRequest: {
        httpCode = 400;
        break;
      }
      case Unauthorized: {
        httpCode = 401;
        break;
      }
      case Forbidden: {
        httpCode = 403;
        break;
      }
      case NotFound: {
        httpCode = 404;
        break;
      }
      case TimeOut: {
        httpCode = 408;
        break;
      }
      case InternalServerError: {
        httpCode = 500;
        break;
      }
      case NotImplemented: {
        httpCode = 501;
        break;
      }
      default: {
        httpCode = 500;
        break;
      }
    }

    const response = {
      error: error.constructor.name,
      context: (error as CustomError).context || undefined,
    };

    if (
      process.env.NODE_ENV &&
      ['production', 'prod'].includes(process.env.NODE_ENV)
    ) {
      delete response.context;
    }

    reply.status(httpCode).send(response);
  } else {
    reply.status(500).send({ error: 'An unexpected error occured' });
  }
};

export default errorHandler;
