import { BulletFactory } from '@bulletjs/core';
import { ConnectionManager } from '@bulletjs/orm';
import { LoggerMiddleware } from './middlewares/LoggerMiddleware';
import '../routes/web'; // Load web routes
import '../routes/api'; // Load api routes

async function bootstrap() {
  const { Config } = await import('@bulletjs/core');
  
  // Ensure config is loaded from the correct directory in this monorepo/symlink setup
  await Config.load(`${process.cwd()}/config`);
  
  const dbConfig = Config.get('database');
  if (dbConfig) {
     ConnectionManager.setConfig(dbConfig);
     ConnectionManager.connect();
  }

  const app = BulletFactory.create();
  
  // Middleware registration (Example)
  app.use(new LoggerMiddleware().handle);
  
  app.start(3000);
}

bootstrap();
