# @bullet-js/core

The bootstrapping kernel for BulletJS. This package handles configuration loading, environment variable management, and the central `Application` initialization.

## Features

- **⚙️ Config Management**: Typed configuration loader (`Config.get('app.name')`).
- **🌍 Environment**: Typesafe `.env` file parsing and access.
- **🏗️ Application Kernel**: Bootstraps the framework, matching HTTP requests to Routes.
- **📦 Service Container**: Central registry for core services.

## Installation

```bash
bun add @bullet-js/core
```

## Usage

This package is typically initialized automatically by the framework scaffold, but you can use its components directly:

### Accessing Config

```typescript
import { Config } from '@bullet-js/core';

const appName = Config.get('app.name', 'My App');
```

### Bootsrapping

```typescript
import { Application } from '@bullet-js/core';

const app = await Application.getInstance();
app.start();
```
