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
   * Removes the 'error' key from the error response
   */
  hideError?: boolean;
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
              fastify.log.error(error);
              break;
            }
          }

          const response = {
            error: error.message,
            context: (error as CustomError).context || undefined,
            ...(options?.hideError ? {} : { stack: error.stack }),
          };

          reply.status(httpCode).send(response);
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          if (error?.validation?.length > 0) {
            reply.status(400).send({
              error: 'Bad Request',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              context: `${error?.validationContext || ''} ${
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                error?.validation[0].message
              }`,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              ...(options?.hideError ? {} : { stack: error.stack }),
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
          } else if (error?.message?.toLowerCase()?.includes('rate limit')) {
            reply.status(429).send({
              error: 'Too Many Requests',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              ...(options?.hideError ? {} : { stack: error.stack }),
            });
          } else {
            reply.status(500).send({
              error: 'An unexpected error occured',
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              ...(options?.hideError ? {} : { stack: error.stack }),
            });
            fastify.log.error(error);
          }
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
