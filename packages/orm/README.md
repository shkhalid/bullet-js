# @bullet-js/orm

The official BulletJS ORM. A high-performance, developer-friendly database layer powered by [Kysely](https://kysely.dev).

## Features

- **✅ Kysely Powered**: Full SQL query builder with type safety.
- **🚀 Bun Native SQLite**: Specialized dialect for lightning-fast synchronous SQLite operations.
- **💎 Laravel-style Models**: Clean `Model` class with hydration and lifecycle methods.
- **📦 Collections**: Rich, chainable collection objects for array-like result sets.
- **🔄 Multi-driver**: Supports SQLite, MySQL, Postgres, and SQL Server.

## Installation

```bash
bun add @bullet-js/orm kysely
```

## Basic Usage

### Define a Model

```typescript
import { Model } from '@bullet-js/orm';

export class User extends Model {
    protected static tableName = 'users';
}
```

### Fetch Data

```typescript
// Get all users
const users = await User.all();

// Find by ID
const user = await User.find(1);

// Filter collection
const admins = users.filter(u => u.attributes.is_admin);
```

## Dialects

When using with SQLite on Bun, this package automatically uses a custom `BunSqliteDialect` to bridge Kysely with Bun's native synchronous driver, achieving superior performance compared to standard drivers.
