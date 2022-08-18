import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
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

export interface Options {
  /**
   * Removes the 'context' key from the error response if NODE_ENV is 'production'
   */
  hideContextOnProd: boolean;
}

const errorPlugin: FastifyPluginAsync<Options> = fp(
  async (fastify: FastifyInstance, options: Options) => {
    fastify.setErrorHandler(
      (error: CustomError, _: FastifyRequest, reply: FastifyReply) => {
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
            error: error.message,
            context: (error as CustomError).context || undefined,
          };

          if (
            options?.hideContextOnProd !== false &&
            process.env.NODE_ENV === 'production'
          ) {
            delete response.context;
          }

          reply.status(httpCode).send(response);
        } else {
          reply.status(500).send({ error: 'An unexpected error occured' });
        }
      }
    );

    fastify.setNotFoundHandler(() => {
      throw new NotFound();
    });
  },
  {
    fastify: '4.x',
    name: 'unify-fastify',
  }
);

export default errorPlugin;
