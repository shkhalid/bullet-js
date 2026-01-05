import { MigrationProvider, Migration, MigrationInfo } from 'kysely';
import * as fs from 'fs';
import * as path from 'path';

export class BunMigrationProvider implements MigrationProvider {
  constructor(private migrationFolder: string) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = {};
    
    // Ensure folder exists
    if (!fs.existsSync(this.migrationFolder)) {
      return migrations;
    }

    const files = fs.readdirSync(this.migrationFolder);

    for (const file of files) {
      if (!file.endsWith('.ts') && !file.endsWith('.js')) {
        continue;
      }

      const filePath = path.join(this.migrationFolder, file);
      // Dynamic import
      const migration = await import(filePath);
      
      const migrationKey = file.substring(0, file.lastIndexOf('.'));
      
      migrations[migrationKey] = {
        up: migration.up,
        down: migration.down,
      };
    }

    return migrations;
  }
}
