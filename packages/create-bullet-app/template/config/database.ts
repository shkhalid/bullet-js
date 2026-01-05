import { Env } from '@bulletjs/core';

export default {
  default: Env.get('DB_CONNECTION', 'sqlite'),

  connections: {
    sqlite: {
      driver: 'sqlite',
      database: `${process.cwd()}/${Env.get('DB_DATABASE', 'database/database.sqlite')}`,
    },

    mysql: {
      driver: 'mysql',
      host: Env.get('DB_HOST', '127.0.0.1'),
      port: Env.get('DB_PORT', 3306),
      database: Env.get('DB_DATABASE', 'forge'),
      username: Env.get('DB_USERNAME', 'forge'),
      password: Env.get('DB_PASSWORD', ''),
    },

    pgsql: {
      driver: 'pgsql',
      host: Env.get('DB_HOST', '127.0.0.1'),
      port: Env.get('DB_PORT', 5432),
      database: Env.get('DB_DATABASE', 'forge'),
      username: Env.get('DB_USERNAME', 'forge'),
      password: Env.get('DB_PASSWORD', ''),
    },

    sqlsrv: {
      driver: 'sqlsrv',
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', 1433),
      database: Env.get('DB_DATABASE', 'forge'),
      username: Env.get('DB_USERNAME', 'forge'),
      password: Env.get('DB_PASSWORD', ''),
    },
  },
};
