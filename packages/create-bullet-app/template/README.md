# BulletJS App Template

This is a starter template for building applications with **BulletJS**, the high-performance full-stack framework for Bun.

## 🚀 Features

- **⚡ Fast**: Powered by Bun and native SQLite.
- **⚛️ React SSR**: Hybrid rendering out of the box.
- **📦 ORM**: Simple and powerful model system.
- **🔄 Hot Reloading**: Instant feedback during development.

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
bun install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Run Migrations
```bash
bun x bullet migrate
```

### 4. Start Development Server
```bash
bun dev
```

Your app will be running at `http://localhost:3000`.

## 📂 Directory Structure

- `app/`: Your core application logic (Models, Controllers).
- `config/`: Application configuration files.
- `resources/`: Frontend assets (React views, CSS).
- `routes/`: Route definitions (`web.ts`, `api.ts`).
- `public/`: Static files.

## 📖 Documentation

For full documentation, visit [bulletjs.com](https://bulletjs.com) (Coming soon).
