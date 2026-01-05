export class Collection<T = any> {
  protected items: T[];

  constructor(items: T[] = []) {
    this.items = items;
  }

  // Core methods
  all(): T[] {
    return this.items;
  }

  count(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  isNotEmpty(): boolean {
    return !this.isEmpty();
  }

  // Transformation methods
  map<U>(callback: (item: T, index: number) => U): Collection<U> {
    return new Collection(this.items.map(callback));
  }

  filter(callback: (item: T, index: number) => boolean): Collection<T> {
    return new Collection(this.items.filter(callback));
  }

  toArray(): T[] {
    return [...this.items];
  }

  // JSON serialization
  toJSON(): T[] {
    return this.items;
  }

  // aggregation, filtering, etc (subset for now to keep it simple while debugging)
  first(): T | undefined {
    return this.items[0];
  }

  last(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

export function collect<T>(items: T[] = []): Collection<T> {
  return new Collection(items);
}
