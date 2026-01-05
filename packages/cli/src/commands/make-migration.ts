import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export const makeMigrationCommand = new Command('make:migration')
  .description('Create a new migration file')
  .argument('<name>', 'The name of the migration')
  .action(async (name) => {
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
    const fileName = `${timestamp}_${name}.ts`;
    
    const template = `import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // await db.schema.createTable('table_name')...
}

export async function down(db: Kysely<any>): Promise<void> {
  // await db.schema.dropTable('table_name').execute();
}
`;
    
    // Default to database/migrations
    const targetDir = path.join(process.cwd(), 'database', 'migrations');
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const targetFile = path.join(targetDir, fileName);
    
    fs.writeFileSync(targetFile, template);
    
    console.log(`Migration [database/migrations/${fileName}] created successfully.`);
  });
