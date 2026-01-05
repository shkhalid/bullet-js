import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { ConnectionManager } from '@bulletjs/orm';

async function bootstrapDB() {
    // Re-use logic or proper bootstrapper
    ConnectionManager.connect({
        database: process.env.DB_DATABASE || 'database.sqlite',
        debug: true
    });
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
