
import { Route } from './route';

export const RouterFacade = {
  get: (path: string, handler: any) => Route.get(path, handler),
  post: (path: string, handler: any) => Route.post(path, handler),
  put: (path: string, handler: any) => Route.put(path, handler),
  delete: (path: string, handler: any) => Route.delete(path, handler),
};
