import React from 'react';
import { renderToString } from 'react-dom/server';
import * as path from 'path';

export class ViewFactory {
  constructor(private viewsPath: string) {}

  async render(viewName: string, props: any = {}, req?: any) {
    // Check for JSON/Inertia request
    if (req && (req.header('X-Bullet-Inertia') || req.header('x-bullet-inertia'))) {
        return Response.json({
            component: viewName,
            props
        });
    }

    const viewPath = path.join(this.viewsPath, `${viewName}.tsx`);
    const module = await import(viewPath);
    const Component = module.default;
    
    // SSR
    // We need to provide a dummy Router context so <Link> doesn't crash
    // Since we don't have easy access to the RouterContext object here (it's in userland code),
    // we should ideally import it. But this package is generic.
    // OPTION 1: The user should wrap their components in providers.
    // OPTION 2: We mock it? No, Context relies on reference equality.
    
    // CRITICAL: The ViewFactory inside @bulletjs/view doesn't know about ../js/router.
    // However, the `Component` loaded via `import(viewPath)` IS the user code.
    // If THAT component uses `Link`, it expects context.
    
    // A simple fix for <Link> in SSR is to make it robust against missing context.
    // I already updated `Link` in `router.tsx` to handle `navigate` being undefined.
    // So this should just work!
    
    // Check for persistent layout
    const element = React.createElement(Component, props);
    const content = Component.layout ? Component.layout(element) : element;
    
    const html = renderToString(content);

    return new Response(`<!DOCTYPE html>
<html>
<head>
    <title>BulletJS App</title>
</head>
<body>
    <div id="root">${html}</div>
    <script>
        window.__INITIAL_DATA__ = {
            component: '${viewName}',
            props: ${JSON.stringify(props)}
        };
    </script>
    <script type="module" src="/_bullet/client.js"></script>
    <script type="module" src="/_bullet/client.js"></script>
    <script>
    (function() {
        let lastId = null;
        setInterval(() => {
            fetch('/_bullet/ping')
                .then(r => r.text())
                .then(id => {
                    if (lastId && id !== lastId) {
                        window.location.reload();
                    }
                    lastId = id;
                })
                .catch(() => {
                    // Connection lost, technically good place to set a flag,
                    // but for now we just wait for it to come back up with a new ID
                });
        }, 2000);
    })();
    </script>
</body>
</html>`, {
    headers: { 'Content-Type': 'text/html' }
}); 
  }

  // New method to just return data for JSON responses
  make(viewName: string, props: any = {}) {
      return {
          component: viewName,
          props
      };
  }
}
