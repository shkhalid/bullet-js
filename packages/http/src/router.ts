export type RouteHandler = Function | [any, string];

export interface RouteDefinition {
  method: string;
  path: string;
  handler: RouteHandler;
  middleware: any[];
}

export class Router {
  private static routes: RouteDefinition[] = [];

  static get(path: string, handler: RouteHandler) {
    return this.addRoute('GET', path, handler);
  }

  static post(path: string, handler: RouteHandler) {
    return this.addRoute('POST', path, handler);
  }

  static put(path: string, handler: RouteHandler) {
    return this.addRoute('PUT', path, handler);
  }

  static delete(path: string, handler: RouteHandler) {
    return this.addRoute('DELETE', path, handler);
  }

  private static addRoute(method: string, path: string, handler: RouteHandler) {
    const route: RouteDefinition = { method, path, handler, middleware: [] };
    this.routes.push(route);
    
    const wrapper = {
        middleware: (m: any | any[]) => {
            if (Array.isArray(m)) {
                route.middleware.push(...m);
            } else {
                route.middleware.push(m);
            }
            return wrapper;
        }
    };

    return wrapper;
  }

  static getRoutes(): RouteDefinition[] {
    return this.routes;
  }

  static match(method: string, url: string): { route: RouteDefinition, params: Record<string, string> } | null {
    const urlPath = new URL(url).pathname;

    for (const route of this.routes) {
      if (route.method !== method) continue;

      // Simple regex matching for :params
      const routeRegexStr = '^' + route.path.replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[^/]+)') + '$';
      const routeRegex = new RegExp(routeRegexStr);
      const match = urlPath.match(routeRegex);

      if (match) {
        return {
          route,
          params: match.groups || {}
        };
      }
    }

    return null;
  }
}
