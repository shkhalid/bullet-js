# @bullet-js/cli

The official Command Line Interface for BulletJS. It provides a suite of tools to scaffold projects, generate code, and manage database migrations.

## Features

- **🚀 Scaffolding**: Create new projects instantly (`create-bullet-app`).
- **🏭 Generators**: Make Controllers, Models, and Migrations with a single command.
- **🗄️ Database Management**: Run and rollback migrations.

## Installation

```bash
bun add -D @bullet-js/cli
```

## Usage

### Commands

```bash
# Generate a Controller
bun run bjs make:controller PostController

# Generate a Model
bun run bjs make:model Post

# Create a Migration
bun run bjs make:migration create_posts_table

# Run Migrations
bun run bjs migrate
```
