[![Test Coverage](https://api.codeclimate.com/v1/badges/d47a13f51cd7b2e75029/test_coverage)](https://codeclimate.com/github/qlaffont/unify-fastify/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/d47a13f51cd7b2e75029/maintainability)](https://codeclimate.com/github/qlaffont/unify-fastify/maintainability)
![npm](https://img.shields.io/npm/v/unify-fastify) ![npm](https://img.shields.io/npm/dm/unify-fastify) ![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/unify-fastify) ![NPM](https://img.shields.io/npm/l/unify-fastify)
# Unify Fastify

A Fastify plugin wrapping [unify-errors](https://github.com/qlaffont/unify-errors) to handle REST errors. Old Owner: [@flexper](https://github.com/flexper)

## Install

```sh
npm i unify-fastify
# Or
yarn add unify-fastify
# Or
pnpm add unify-fastify
```

## Use

```typescript
import fastify from 'fastify'
import unifyFastifyPlugin from 'unify-fastify';
import { BadRequest } from 'unify-errors';

const server = fastify()
server.register(unifyFastifyPlugin, { /* options */ })

server.get('/bad-request', async () => {
  throw new BadRequest({ example: 'A bad request error'})
})
```

## Plugin options

| name             | default | description                      |
| ---------------- | ------- | -------------------------------- |
| _disableDetails_ | false   | Disable error details like stack |
| _disableLog_     | false   | Disable logging on error         |


## Tests

To execute jest tests (all errors, type integrity test)

```
pnpm test
```

## Maintain

This package use [TSdx](https://github.com/jaredpalmer/tsdx). Please check documentation to update this package.
