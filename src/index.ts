/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { FastifyReply, FastifyRequest } from 'fastify';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const fp = require('fastify-plugin');
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
  disableDetails?: boolean;

  /**
   * Removes log from this errors
   */
  disableLog?: boolean;
}

const errorPlugin: FastifyPluginAsync<Options> = fp(
  async (fastify: FastifyInstance, options: Options) => {
    fastify.setErrorHandler(
      (error: CustomError, _: FastifyRequest, reply: FastifyReply) => {
          let httpCode = 0;
          let customErrorMessage;

          const errorName = error.constructor.name === "Error" ? error.name || "Error" : error.constructor.name;

          switch (errorName) {
            case BadRequest.name: {
              httpCode = 400;
              break;
            }
            case Unauthorized.name: {
              httpCode = 401;
              break;
            }
            case Forbidden.name: {
              httpCode = 403;
              break;
            }
            case NotFound.name: {
              httpCode = 404;
              break;
            }
            case TimeOut.name: {
              httpCode = 408;
              break;
            }
            case InternalServerError.name: {
              httpCode = 500;
              break;
            }
            case NotImplemented.name: {
              httpCode = 501;
              break;
            }
            default: {
              httpCode = 500;
              customErrorMessage = "An unexpected error occured";
              //@ts-ignore
              break;
            }
          }

          if(!options?.disableLog){
            fastify.log.error(error);
          }

          const response = {
            error: customErrorMessage || error.message,
            context: (error as CustomError).context || undefined,
            ...(options?.disableDetails ? {} : { stack: error.stack, errorDetails: error.message }),
          };

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          if (error?.validation?.length > 0) {
            reply.status(400).send({
              error: 'Bad Request',
              context: `${
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                error?.validationContext || ''
              } ${// eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              error?.validation[0].message}`,
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
              ...(options?.disableDetails ? {} : { stack: error.stack }),
            });
          } else {
            reply.status(httpCode).send(response);
            //@ts-ignore
            fastify.log.error(error);
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
