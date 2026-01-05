#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';
import { fileURLToPath } from 'url';
import { reset, red, green, bold, cyan } from 'kleur/colors';

async function init() {
  console.log(bold(cyan('\n🚀 Welcome to BulletJS!\n')));

  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: 'What is the name of your project?',
      initial: 'my-bullet-app'
    }
  ]);

  if (!response.projectName) {
    console.log(red('✖ Operation cancelled'));
    process.exit(1);
  }

  const projectDir = path.join(process.cwd(), response.projectName);

  if (fs.existsSync(projectDir)) {
    console.log(red(`\n✖ Directory "${response.projectName}" already exists!`));
    process.exit(1);
  }

  console.log(`\nCreating a new BulletJS app in ${green(projectDir)}...`);

  // Copy template
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const templateDir = path.resolve(__dirname, '../template');

  try {
    await fs.copy(templateDir, projectDir);
    
    // Update package.json name
    const pkgPath = path.join(projectDir, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.name = response.projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    
    // Copy .env.example to .env
    const envExamplePath = path.join(projectDir, '.env.example');
    const envPath = path.join(projectDir, '.env');
    if (await fs.pathExists(envExamplePath)) {
      await fs.copy(envExamplePath, envPath);
    }
    
    // Ensure database directory exists with database.sqlite
    const dbDir = path.join(projectDir, 'database');
    await fs.ensureDir(dbDir);
    await fs.ensureDir(path.join(dbDir, 'migrations'));
    await fs.ensureDir(path.join(dbDir, 'seeders'));
    
    // Create .gitignore
    await fs.writeFile(path.join(projectDir, '.gitignore'), `node_modules
dist
.env
.DS_Store
*.sqlite
.bullet
resources/js/pages.ts
`);

    console.log(green('\n✔ Info: Project created successfully!'));
    console.log('\nNext steps:');
    console.log(`  cd ${response.projectName}`);
    console.log('  bun install');
    console.log('  bun run dev');
    console.log('\nNote: Make sure to publish @bullet-js/* packages to npm first, or use local workspace links for development.');
    
  } catch (e) {
    console.error(red('✖ Error creating project:'), e);
  }
}

init();
