import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

import errorHandler from '../handler/ErrorHandler';

const errorPlugin: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance, _: any) => {
    fastify.setErrorHandler(errorHandler);
  }
);

export default errorPlugin;
