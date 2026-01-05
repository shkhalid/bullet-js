
import { 
  Kysely, 
  SqliteDialect, 
  PostgresDialect, 
  MysqlDialect, 
  MssqlDialect 
} from 'kysely';
// @ts-ignore
import { Pool } from 'pg'; // Postgres pool
import { createPool } from 'mysql2'; // MySQL pool
import * as tedious from 'tedious'; // MSSQL driver
import * as tarn from 'tarn'; // MSSQL pool dependency
import { BunSqliteDialect } from './bun-sqlite-dialect';

interface DBConfig {
  default: string;
  connections: Record<string, any>;
}

export class ConnectionManagerInternal {
  private static instance: Kysely<any>;
  private static config: DBConfig;
  static setConfig(config: DBConfig) {
    this.config = config;
  }

  static connect(config?: any): Kysely<any> {
    if (this.instance) return this.instance;

    // Backward compatibility for direct config pass
    if (config && config.database && !config.connections) {
        this.instance = new Kysely({
            dialect: new BunSqliteDialect({
                database: config.database,
            }),
        });
        return this.instance;
    }

    // New Config structure usage
    const activeConnectionName = this.config?.default || 'sqlite';
    const activeConfig = this.config?.connections?.[activeConnectionName] || config;

    if (!activeConfig) {
        throw new Error(`Database connection '${activeConnectionName}' not configured.`);
    }

    let dialect;

    switch (activeConfig.driver) {
      case 'sqlite':
        dialect = new BunSqliteDialect({
          database: activeConfig.database,
        });
        break;
        
      case 'pgsql':
      case 'postgres':
        dialect = new PostgresDialect({
          pool: new Pool({
            host: activeConfig.host,
            port: activeConfig.port,
            database: activeConfig.database,
            user: activeConfig.username,
            password: activeConfig.password,
          })
        });
        break;

      case 'mysql':
        dialect = new MysqlDialect({
          pool: createPool({
            host: activeConfig.host,
            user: activeConfig.username,
            password: activeConfig.password,
            database: activeConfig.database,
            port: activeConfig.port || 3306,
          })
        });
        break;

      case 'sqlsrv':
      case 'mssql':
        dialect = new MssqlDialect({
          tarn: {
            ...tarn,
            options: {
              min: 0,
              max: 10,
            },
          },
          tedious: {
            ...tedious,
            connectionFactory: () => new tedious.Connection({
                server: activeConfig.host,
                authentication: {
                    type: 'default',
                    options: {
                        userName: activeConfig.username,
                        password: activeConfig.password
                    }
                },
                options: {
                    port: activeConfig.port || 1433,
                    database: activeConfig.database,
                    trustServerCertificate: true 
                }
            })
          },
        });
        break;

      default:
        throw new Error(`Unsupported database driver: ${activeConfig.driver}`);
    }

    this.instance = new Kysely<any>({
      dialect,
    });

    return this.instance;
  }

  static getInstance(): Kysely<any> {
    if (!this.instance) {
      throw new Error("Database not connected. Call ConnectionManager.connect() first.");
    }
    return this.instance;
  }
  
  static getQuery() {
      return this.getInstance();
  }
}

export const ConnectionManager = ConnectionManagerInternal;
