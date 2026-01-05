import { Command } from 'commander';
import { Migrator, ConnectionManager } from '@bullet-js/orm';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Helper to load config
async function bootstrapDB() {
    // Try to find a bullet-config or database config file if needed.
    // For now we assume a simple 'bullet.config.ts' or params if we had them.
    // BUT we need a way to initialize the ConnectionManager from the project scope.
    
    // We can try to load the user's data-source configuration.
    // For MVP, lets expect a `database.ts` or `src/database.ts` file that exports a connection or configuration
    // OR we just default to 'sqlite.db' if nothing found.
    
    // BETTER: Use standard convention. .env file in root.
    
    ConnectionManager.connect({
        database: process.env.DB_DATABASE || 'database/database.sqlite',
        debug: true
    });
}


export const migrateCommand = new Command('migrate')
  .description('Run valid migrations')
  .action(async () => {
    try {
        await bootstrapDB();
        await Migrator.run();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
  });
