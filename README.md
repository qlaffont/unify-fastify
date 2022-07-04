# Unify Fastify

A Fastify plugin wrapping [unify-errors](https://github.com/flexper/unify-errors) to handle REST errors

## Use

```typescript
import fastify from 'fastify'
import errorPlugin from 'unify-fastify';
import { BadRequest } from 'unify-errors';

const server = fastify()
server.register(errorPlugin)

server.get('/bad-request', async () => {
  throw new BadRequest({ example: 'A bad request error'})
})
```

## Tests

To execute jest tests (all errors, type integrity test)

```
pnpm test
```

## Maintain

This package use [TSdx](https://github.com/jaredpalmer/tsdx). Please check documentation to update this package.
