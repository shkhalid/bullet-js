import { Glob } from "bun";
import { Env } from './env';

export class Config {
  private static items: Record<string, any> = {};

  static async load(configPath: string) {
    const glob = new Glob("**/*.ts");
    
    // Scan config directory
    for await (const file of glob.scan({ cwd: configPath })) {
        const configName = file.replace('.ts', '');
        const mod = await import(`${configPath}/${file}`);
        this.items[configName] = mod.default;
    }
  }

  static get(key: string, defaultValue: any = null): any {
    const keys = key.split('.');
    let current = this.items;

    for (const k of keys) {
      if (current[k] === undefined) {
        return defaultValue;
      }
      current = current[k];
    }

    return current;
  }
}
