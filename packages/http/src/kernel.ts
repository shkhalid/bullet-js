import { Router } from './router';
import { Request } from './request';
import { Pipeline, MiddlewareHandler } from './pipeline';

export class Kernel {
  private globalMiddleware: MiddlewareHandler[] = [];

  use(middleware: MiddlewareHandler) {
      this.globalMiddleware.push(middleware);
  }

  async handle(req: Request): Promise<Response> {
    const method = req.method();
    const url = req.url();
    const match = Router.match(method, url);

    const pipeline = new Pipeline();
    
    // Add global middleware
    this.globalMiddleware.forEach(m => pipeline.use(m));

    if (match) {
        // Add route-specific middleware
        match.route.middleware.forEach(m => pipeline.use(m));
        req.setRouteParams(match.params);
    }

    return await pipeline.execute(req, async () => {
        if (!match) {
          return new Response('Not Found', { status: 404 });
        }
        return await this.dispatch(req, match.route);
    });
  }

  private async dispatch(req: Request, route: any): Promise<Response> {
    const handler = route.handler;

    try {
      let result;

      if (Array.isArray(handler)) {
        const [ControllerClass, methodName] = handler;
        const controller = new ControllerClass();
        result = await controller[methodName](req); 
      } else {
        result = await handler(req);
      }

      return this.formatResponse(result);
    } catch (error) {
      console.error(error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  private formatResponse(result: any): Response {
    if (result instanceof Response) {
      return result;
    }
    if (typeof result === 'object') {
      return Response.json(result);
    }
    return new Response(String(result));
  }
}
