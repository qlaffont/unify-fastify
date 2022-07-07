[![Test Coverage](https://api.codeclimate.com/v1/badges/d47a13f51cd7b2e75029/test_coverage)](https://codeclimate.com/github/flexper/unify-fastify/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/d47a13f51cd7b2e75029/maintainability)](https://codeclimate.com/github/flexper/unify-fastify/maintainability)
![npm](https://img.shields.io/npm/v/unify-fastify) ![npm](https://img.shields.io/npm/dm/unify-fastify) ![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vsulnerabilities/npm/unify-fastify) ![NPM](https://img.shields.io/npm/l/unify-fastify)
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
