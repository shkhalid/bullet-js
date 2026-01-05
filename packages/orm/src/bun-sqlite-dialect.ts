import {
  Driver,
  DatabaseConnection,
  QueryResult,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
  Dialect,
  Kysely,
} from 'kysely';
// @ts-ignore
import { Database } from 'bun:sqlite';

export class BunSqliteDialect implements Dialect {
  private config: { database: string };

  constructor(config: { database: string }) {
    this.config = config;
  }

  createDriver(): Driver {
    return new BunSqliteDriver(this.config);
  }

  createQueryCompiler(): SqliteQueryCompiler {
    return new SqliteQueryCompiler();
  }

  createAdapter(): SqliteAdapter {
    return new SqliteAdapter();
  }

  createIntrospector(db: Kysely<any>): SqliteIntrospector {
    return new SqliteIntrospector(db);
  }
}

class BunSqliteDriver implements Driver {
  private db: any;
  private config: { database: string };

  constructor(config: { database: string }) {
    this.config = config;
  }


  async init(): Promise<void> {
    const fs = await import('fs');
    const path = await import('path');
    
    const dir = path.dirname(this.config.database);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.config.database, { create: true });
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    return new BunSqliteConnection(this.db);
  }

  async beginTransaction(conn: DatabaseConnection): Promise<void> {
    await conn.executeQuery({ sql: 'BEGIN', parameters: [] } as any);
  }

  async commitTransaction(conn: DatabaseConnection): Promise<void> {
    await conn.executeQuery({ sql: 'COMMIT', parameters: [] } as any);
  }

  async rollbackTransaction(conn: DatabaseConnection): Promise<void> {
    await conn.executeQuery({ sql: 'ROLLBACK', parameters: [] } as any);
  }

  async releaseConnection(conn: DatabaseConnection): Promise<void> {
    // No-op
  }

  async destroy(): Promise<void> {
    this.db?.close();
  }
}

class BunSqliteConnection implements DatabaseConnection {
  constructor(private db: any) {}

  async executeQuery<R>(compiledQuery: any): Promise<QueryResult<R>> {
    const { sql, parameters } = compiledQuery;
    const stmt = this.db.prepare(sql);

    // Heuristic for bun:sqlite
    // If it's a SELECT or has RETURNING, we want rows.
    if (sql.trim().toLowerCase().startsWith('select') || sql.toLowerCase().includes('returning')) {
       const rows = stmt.all(...parameters) as R[];
       return { rows };
    } else {
       const result = stmt.run(...parameters);
       return {
         rows: [],
         // @ts-ignore
         numAffectedRows: BigInt(result.changes),
         insertId: BigInt(result.lastInsertRowid)
       } as any;
    }
  }

  async *streamQuery() {
    throw new Error('Streaming not supported via bun:sqlite driver yet');
  }
}
