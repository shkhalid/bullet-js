import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

export const makeControllerCommand = new Command('make:controller')
  .description('Create a new controller class')
  .argument('<name>', 'The name of the controller')
  .action(async (name) => {
    // Ensure "Controller" suffix
    const className = name.endsWith('Controller') ? name : `${name}Controller`;
    
    const template = `import { Request } from '@bullet-js/http';

export class ${className} {
  async index(req: Request) {
    return 'List of items';
  }

  async store(req: Request) {
    return 'Create item';
  }

  async show(req: Request) {
    const id = req.param('id');
    return \`Show item \${id}\`;
  }

  async update(req: Request) {
    const id = req.param('id');
    return \`Update item \${id}\`;
  }

  async destroy(req: Request) {
    const id = req.param('id');
    return \`Delete item \${id}\`;
  }
}
`;
    
    // Default to src/controllers
    const targetDir = path.join(process.cwd(), 'src', 'controllers');
    
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const targetFile = path.join(targetDir, `${className}.ts`);
    
    if (fs.existsSync(targetFile)) {
      console.error(`Controller ${className} already exists!`);
      return;
    }

    fs.writeFileSync(targetFile, template);
    
    console.log(`Controller [src/controllers/${className}.ts] created successfully.`);
  });
