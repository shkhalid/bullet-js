export class Env {
  static get(key: string, defaultValue: any = null): string | any {
    const value = process.env[key];
    if (value === undefined) return defaultValue;
    
    // Handle booleans
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    // Handle null
    if (value.toLowerCase() === 'null') return null;
    
    return value;
  }
}
