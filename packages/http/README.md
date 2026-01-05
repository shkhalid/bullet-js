# @bulletjs/http

The HTTP foundation for BulletJS. Handles routing, middleware, and request/response pipelines.

## Features

- **🗺️ Expressive Routing**: Define routes with a familiar fluent API.
- **🛡️ Middleware Pipelines**: Robust middleware system using the onion pattern.
- **🚦 Throttling**: Built-in IP-based rate limiting.
- **📥 Simplified Request**: Easy access to inputs, headers, and IP identification.

## Installation

```bash
bun add @bulletjs/http
```

## Usage

### Simple Routing

```typescript
import { Route } from '@bulletjs/http';

Route.get('/', async (req) => {
    return { message: 'Hello World' };
});
```

### Middleware & Throttling

```typescript
import { Route, throttle } from '@bulletjs/http';

Route.get('/heavy-process', async () => 'Processing...')
     .middleware(throttle(10, 1)); // 10 requests per minute
```

### Route Parameters

```typescript
Route.get('/users/:id', async (req) => {
    const id = req.param('id');
    return `User: ${id}`;
});
```
