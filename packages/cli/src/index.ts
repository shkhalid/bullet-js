import { Command } from 'commander';
import { makeModelCommand } from './commands/make-model';

const program = new Command();

program
  .name('bullet')
  .description('BulletJS CLI - The Laravel-like framework for Bun')
  .version('0.0.1');

import { makeMigrationCommand } from './commands/make-migration';
import { migrateCommand } from './commands/migrate';
import { makeControllerCommand } from './commands/make-controller';
import { seedCommand } from './commands/seed';

program.addCommand(makeModelCommand);
program.addCommand(makeMigrationCommand);
program.addCommand(migrateCommand);
program.addCommand(makeControllerCommand);
program.addCommand(seedCommand);

program.parse(process.argv);
