# 🚀 BulletJS

BulletJS is a high-performance, full-stack web framework designed for the **Bun** runtime. It combines the developer experience (DX) of **Laravel** with the speed of **Bun** and the rendering power of **React**.

## ✨ Key Features

- **🚀 Extreme Performance**: Handles over 5,000 requests per second (RPS) on a single core using Bun's native SQLite driver.
- **💎 Laravel-like DX**: Elegant routing, middleware, models, and collections.
- **⚛️ React SSR**: Hybrid rendering with React components on the server.
- **⚡ Hot Reload**: Instant reflected changes in the browser during development.
- **📦 Monorepo Architecture**: Modular packages (`@bullet-js/core`, `@bullet-js/orm`, etc.).
- **🛠️ Built-in ORM**: Powerful database interaction via Kysely with full TypeScript support.
- **🛡️ Rate Limiting**: Simple IP-based throttling out of the box.

---

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Database**: [Kysely](https://kysely.dev) (SQLite, Postgres, MySQL, MSSQL)
- **UI**: [React](https://reactjs.org) + [TailwindCSS](https://tailwindcss.com) (Optional)
- **CLI**: `@bullet-js/create-bullet-app`

---

## 🚀 Getting Started

The easiest way to start is using the CLI:

```bash
bun x create-bullet-app my-app
cd my-app
bun install
bun run dev
```

---

## 📖 Framework Overview

### 🗺️ Routing
Define routes in `routes/web.ts` or `routes/api.ts`. Use Laravel-style controller binding or closures.

```typescript
import { Route, throttle } from '@bullet-js/http';

Route.get('/', async () => 'Welcome to BulletJS!');

// Protected route with throttling
Route.get('/api/data', [DataController, 'index'])
     .middleware(throttle(60, 1)); // 60 requests per minute
```

### 🗄️ ORM & Models
BulletJS ORM provides a fluent interface for your database.

```typescript
import { Model } from '@bullet-js/orm';

export class Post extends Model {
    protected static tableName = 'posts';
}

// Usage
const posts = await Post.all(); // Returns a Collection
const activePosts = posts.filter(p => p.attributes.status === 'active');
```

### 🖼️ Views (SSR + Inertia Style)
BulletJS uses React for views and provides a seamless way to pass data from your routes.

```typescript
Route.get('/posts', async (req) => {
    const posts = await Post.all();
    return View.render('Home', { posts: posts.toArray() }, req);
});
```

---

## 📦 Core Packages

| Package | Purpose |
| :--- | :--- |
| **[`@bullet-js/core`](./packages/core)** | Bootstrapping, Config, and Manifest generation. |
| **[`@bullet-js/http`](./packages/http)** | Request/Response, Routing, and Middleware. |
| **[`@bullet-js/orm`](./packages/orm)** | Kysely-powered database layer and Model system. |
| **[`@bullet-js/view`](./packages/view)** | React SSR and Hot Reload logic. |
| **[`@bullet-js/validation`](./packages/validation)** | Robust data validation system. |
| **[`@bullet-js/cli`](./packages/cli)** | Command-line tools for scaffolding and generation. |

---

## 📊 Performance Benchmark

BulletJS is built for extreme efficiency. Here are the results from our load tests running on a single core (MacBook M2):

### 1. Hello World (Baseline)
- **Endpoint**: `GET /hello` (Returns plain string)
- **Requests Per Second**: `~9,500 RPS`
- **Average Latency**: `~15ms`
- **Concurrency**: `200`

### 2. Database + Serialization (Real World)
- **Endpoint**: `GET /posts` (SQL Select + hydration + JSON serialization)
- **Requests Per Second**: `~6,500 RPS`
- **Average Latency**: `~8ms` (optimized pipeline)
- **Concurrency**: `100+`

> *Note: Benchmarks were performed using Bun's native HTTP server and SQLite driver.*

---

## 🤝 Contributing

BulletJS is an open-source project. Contributions are welcome!

1. Clone the repo
2. Run `bun install`
3. Start the playground: `bun run dev`

---

## 📄 License

The BulletJS framework is open-source software licensed under the [MIT license](LICENSE).
