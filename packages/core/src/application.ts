import { Kernel } from '@bullet-js/http';
import * as path from 'path';

export class Application {
  private kernel: Kernel;

  constructor() {
    this.kernel = new Kernel();
  }

  use(middleware: any) {
    this.kernel.use(middleware);
    return this;
  }

  async start(port: number = 3000) {
    const SERVER_ID = Math.random().toString(36).substring(7);
    console.log(`BulletJS Application started on http://localhost:${port} (ID: ${SERVER_ID})`);
    
    // Load Config
    const { Config } = await import('./config');
    const configPath = path.join(process.cwd(), 'config');
    
    try {
        await Config.load(configPath);
    } catch (e) {
        // Config might not exist
    }
    
    // Setup Database Connection
    const dbConfig = Config.get('database');
    if (dbConfig) {
        try {
            // @ts-ignore
            const { ConnectionManager } = await import('@bullet-js/orm');
            ConnectionManager.setConfig(dbConfig);
            ConnectionManager.connect();
        } catch (e) {
            // console.error('Failed to load @bullet-js/orm', e); 
        }
    }

    // Auto-generate pages manifest on start
    try {
        const { generatePagesManifest } = await import('./manifest');
        await generatePagesManifest(
            path.join(process.cwd(), 'resources/views'),
            path.join(process.cwd(), 'resources/js')
        );
    } catch (e) {
        // console.error('Failed to generate manifest', e);
    }
    
    // @ts-ignore
    Bun.serve({
      port,
      fetch: async (req: Request, server: any) => {
        const url = new URL(req.url);

        // Serve static files from public directory
        if (!url.pathname.startsWith('/_bullet/')) {
            const publicPath = path.join(process.cwd(), 'public', url.pathname);
            const file = Bun.file(publicPath);
            
            if (await file.exists()) {
                return new Response(file);
            }
        }

        // Handle client-side bundle serving
        if (url.pathname === '/_bullet/client.js') {
            const entry = path.resolve(process.cwd(), 'resources/js/entry.tsx');
            const outfile = path.resolve(process.cwd(), 'node_modules/.cache/bullet/client.js');
            
            try {
                // Determine bun executable path
                const bunPath = process.argv0 || 'bun';

                const proc = Bun.spawn([bunPath, 'build', entry, '--target', 'browser', '--outfile', outfile], {
                    cwd: process.cwd(),
                    stderr: 'pipe'
                });
                
                await proc.exited;

                if (proc.exitCode === 0) {
                    const file = Bun.file(outfile);
                    return new Response(file, { headers: { 'Content-Type': 'application/javascript' } });
                } else {
                    const error = await new Response(proc.stderr).text();
                    console.error('Build Failed:', error);
                    return new Response('Build failed:\n' + error, { status: 500 });
                }
            } catch (e: any) {
                console.error('Build Exception:', e);
                return new Response('Build Exception: ' + e.message, { status: 500 });
            }
        }

        // Hot Reload Ping
        if (url.pathname === '/_bullet/ping') {
            return new Response(SERVER_ID);
        }

        const bulletReq = new (require('@bullet-js/http').Request)(req);
        bulletReq.setIp(server.requestIP(req));
        
        const response = await this.kernel.handle(bulletReq);
        
        // Handle Error Pages (404 / 500)
        if ((response.status === 404 || response.status === 500) && req.headers.get('Accept')?.includes('text/html')) {
            try {
                // Resolve @bullet-js/view from the project's context, not the core package context
                // @ts-ignore
                const { createRequire } = await import('module');
                const projectRequire = createRequire(path.join(process.cwd(), 'package.json'));
                const { View } = projectRequire('@bullet-js/view');
                
                const viewName = response.status === 404 ? 'Errors/404' : 'Errors/500';
                const viewResponse = await View.render(viewName);
                
                // Return response with correct status code
                return new Response(viewResponse.body, {
                    status: response.status,
                    headers: viewResponse.headers
                });
            } catch (e) {
                // Use default response if view rendering fails
            }
        }

        return response;
      },
    });
  }
}

export const BulletFactory = {
  create: () => new Application(),
};
