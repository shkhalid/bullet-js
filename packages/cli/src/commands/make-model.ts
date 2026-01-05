import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export const makeModelCommand = new Command('make:model')
  .description('Create a new Eloquent model class')
  .argument('<name>', 'The name of the model')
  .option('-m, --migration', 'Create a new migration file for the model')
  .action(async (name, options) => {
    const template = `import { Model } from '@bulletjs/orm';

export class ${name} extends Model {
  // static tableName = '${name.toLowerCase()}s';
}
`;
    
    // Default to src/models
    const targetDir = path.join(process.cwd(), 'src', 'models');
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const targetFile = path.join(targetDir, `${name}.ts`);
    
    if (fs.existsSync(targetFile)) {
      console.error(`Model ${name} already exists!`);
      return;
    }

    fs.writeFileSync(targetFile, template);
    
    console.log(`Model [src/models/${name}.ts] created successfully.`);
    
    if (options.migration) {
        console.log('Migration creation logic would go here.');
    }
  });
