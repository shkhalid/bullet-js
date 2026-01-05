import { Kysely, InsertResult, UpdateResult, DeleteResult } from 'kysely';
import { ConnectionManager } from './connection';
import { Collection } from './collection';

export abstract class Model {
  protected static tableName: string;
  protected static primaryKey: string = 'id';
  
  // Instance attributes
  public attributes: Record<string, any> = {};

  // Track original attributes for dirty checking
  protected original: Record<string, any> = {};
  
  protected exists: boolean = false;

  constructor(attributes: Record<string, any> = {}) {
    this.fill(attributes);
  }

  /**
   * Get the table name. Tries to guess from class name if not set.
   * Example: User -> users, TodoItem -> todo_items
   */
  public static getTable(): string {
    if (this.tableName) return this.tableName;
    
    // Simple pluralizer (should use a proper library in production)
    const className = this.name;
    const snakeCase = className.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
    return `${snakeCase}s`; 
  }

  public static getPrimaryKey(): string {
    return this.primaryKey;
  }

  protected static get db(): Kysely<any> {
    return ConnectionManager.getInstance();
  }

  protected static query() {
    return this.db.selectFrom(this.getTable());
  }

  /**
   * Fill the model with attributes.
   */
  public fill(attributes: Record<string, any>): this {
    this.attributes = { ...this.attributes, ...attributes };
    return this;
  }

  /**
   * Create a new record and return the instance.
   */
  public static async create<T extends Model>(this: new () => T, attributes: Record<string, any>): Promise<T> {
    const instance = new this();
    instance.fill(attributes);
    await instance.save();
    return instance;
  }

  /**
   * Find a record by primary key.
   */
  public static async find<T extends Model>(this: new () => T, id: string | number): Promise<T | null> {
    const result = await (this as any).query()
      .selectAll()
      .where((this as any).getPrimaryKey(), '=', id)
      .executeTakeFirst();

    if (!result) return null;

    const instance = new this();
    instance.hydrate(result);
    return instance;
  }

  /**
   * Get all records.
   */
  public static async all<T extends Model>(this: new () => T): Promise<Collection<T>> {
    const results = await (this as any).query().selectAll().execute();
    const instances = results.map((r: any) => {
      const instance = new this();
      instance.hydrate(r);
      return instance;
    });
    return new Collection(instances);
  }

  /**
   * Where clause wrapper.
   */
  public static where(column: string, operator: any, value?: any) {
    return (this as any).query().where(column, operator, value);
  }

  /**
   * Save the current instance (insert or update).
   */
  public async save(): Promise<void> {
    const table = (this.constructor as typeof Model).getTable();
    const pk = (this.constructor as typeof Model).getPrimaryKey();
    const db = ConnectionManager.getInstance();

    if (this.exists) {
      // Update
      // Only update changed attributes in a real app
      await db.updateTable(table)
        .set(this.attributes)
        .where(pk, '=', this.attributes[pk])
        .execute();
    } else {
      // Insert
      const result = await db.insertInto(table)
        .values(this.attributes)
        .returningAll()
        .executeTakeFirst();

      if (result) {
        this.hydrate(result);
      }
    }
  }

  /**
   * Delete the current instance.
   */
  public async delete(): Promise<void> {
    if (!this.exists) return;

    const table = (this.constructor as typeof Model).getTable();
    const pk = (this.constructor as typeof Model).getPrimaryKey();
    const db = ConnectionManager.getInstance();

    await db.deleteFrom(table)
      .where(pk, '=', this.attributes[pk])
      .execute();
      
    this.exists = false;
  }

  /**
   * Load data into the model and mark as existing.
   */
  public hydrate(attributes: Record<string, any>) {
    this.attributes = { ...attributes };
    this.original = { ...attributes };
    this.exists = true;
  }
  
  // Magic method access for attributes (proxies)
  // In JS/TS extending classes, we can use `this.attributes['key']` 
  // or use `__get` equivalent with Proxy if we want `$user.name` to work dynamically without declaration.
  
  public toJSON() {
    return this.attributes;
  }
}
