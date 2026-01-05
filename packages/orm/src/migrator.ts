import { Kysely, Migrator as KyselyMigrator } from 'kysely';
import { BunMigrationProvider } from './bun-migration-provider';
import { ConnectionManager } from './connection';
import * as path from 'path';

export class Migrator {
  private migrator: KyselyMigrator;

  constructor(db: Kysely<any>, migrationFolder: string) {
    this.migrator = new KyselyMigrator({
      db,
      provider: new BunMigrationProvider(migrationFolder),
    });
  }

  static async run(migrationFolder = 'database/migrations'): Promise<void> {
    const db = ConnectionManager.getInstance();
    const absolutePath = path.resolve(process.cwd(), migrationFolder);
    
    const instance = new Migrator(db, absolutePath);
    
    console.log('Running migrations from:', absolutePath);

    const { error, results } = await instance.migrator.migrateToLatest();

    if (results) {
        results.forEach((it) => {
            if (it.status === 'Success') {
                console.log(`Migration "${it.migrationName}" was executed successfully.`);
            } else if (it.status === 'Error') {
                console.error(`failed to execute migration "${it.migrationName}".`);
            }
        });
    }

    if (error) {
      console.error('failed to migrate');
      console.error(error);
      process.exit(1);
    }
    
    console.log('All migrations executed successfully.');
  }
}
