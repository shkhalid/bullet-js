
export class LoggerMiddleware {
  async handle(req: any, next: any) {
    console.log(`[${new Date().toISOString()}] ${req.method()} ${req.url()}`);
    return await next();
  }
}
