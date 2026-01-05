# @bullet-js/view

The rendering engine for BulletJS. This package enables seamless React Server-Side Rendering (SSR) and Client-Side Hydration, inspired by Inertia.js.

## Features

- **⚛️ React SSR**: Render React components on the server for fast initial load and SEO.
- **⚡ Hot Reload**: Custom HMR integration for instant development feedback.
- **🛣️ Client Routing**: SPA-like navigation without full page reloads.
- **🔌 Facades**: Simple `View.render()` API.

## Installation

```bash
bun add @bullet-js/view react react-dom
```

## Usage

### Rendering a View

In your controller or route closure:

```typescript
import { View } from '@bullet-js/view';

Route.get('/', async (req) => {
    return View.render('Home', { 
        title: 'Welcome',
        user: req.user 
    });
});
```

### Client-Side App

This package provides the entry point for hydrating your React app in the browser:

```typescript
// resources/js/entry.tsx
import { App } from '@bullet-js/view';
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('app')!, <App />);
```
