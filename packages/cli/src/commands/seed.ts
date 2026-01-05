import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';

async function bootstrapDB() {
    try {
        // Try to load @bullet-js/orm from the user's project to ensure we share the same singleton
        const projectRequire = createRequire(path.join(process.cwd(), 'package.json'));
        const { ConnectionManager } = projectRequire('@bullet-js/orm');

        ConnectionManager.connect({
            database: process.env.DB_DATABASE || 'database/database.sqlite',
            debug: true
        });
    } catch (e) {
        // Fallback or error if not found
        console.error('Could not load @bullet-js/orm from project. Ensure it is installed.');
        throw e;
    }
}

export const seedCommand = new Command('db:seed')
  .description('Seed the database with records')
  .option('--class <name>', 'The specific seeder class to run', 'DatabaseSeeder')
  .action(async (options) => {
    try {
        await bootstrapDB();
        
        const seederName = options.class;
        // Default location: database/seeders
        const seedersDir = path.join(process.cwd(), 'database', 'seeders');
        const seederFile = path.join(seedersDir, `${seederName}.ts`);
        
        if (!fs.existsSync(seederFile)) {
            console.error(`Seeder class [${seederName}] not found at ${seederFile}`);
            process.exit(1);
        }

        console.log(`Running seeder: ${seederName}`);

        // Dynamic import
        const seederModule = await import(seederFile);
        const SeederClass = seederModule[seederName] || seederModule.default;
        
        if (!SeederClass) {
             console.error(`Could not find class export in ${seederFile}`);
             process.exit(1);
        }

        const seeder = new SeederClass();
        if (typeof seeder.run !== 'function') {
            console.error(`Seeder class ${seederName} does not have a run() method.`);
            process.exit(1);
        }

        await seeder.run();
        
        console.log('Database seeding completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
  });
