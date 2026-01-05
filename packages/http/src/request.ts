
export class Request {
  constructor(private readonly nativeRequest: any) {}

  /**
   * Get an input item from the request.
   */
  async input(key: string, defaultValue?: any): Promise<any> {
    const body = await this.body();
    const query = this.query();
    
    // Priority: Body > Query
    if (body[key] !== undefined) return body[key];
    if (query[key] !== undefined) return query[key];
    
    return defaultValue;
  }

  /**
   * Get all input data.
   */
  async all(): Promise<Record<string, any>> {
    return {
      ...this.query(),
      ...(await this.body()),
    };
  }

  method(): string {
    return this.nativeRequest.method;
  }

  url(): string {
    return this.nativeRequest.url;
  }

  private _query: any;
  query(): any {
    if (this._query) return this._query;
    const url = new URL(this.nativeRequest.url);
    this._query = Object.fromEntries(url.searchParams);
    return this._query;
  }

  private _body: any;
  async body(): Promise<any> {
    if (this._body) return this._body;
    try {
        if (this.method() === 'GET') {
            this._body = {};
        } else {
            this._body = await this.nativeRequest.json();
        }
    } catch {
        this._body = {};
    }
    return this._body;
  }

  private _routeParams: Record<string, string> = {};
  setRouteParams(params: Record<string, string>) {
    this._routeParams = params;
  }
  
  param(key: string) {
    return this._routeParams[key];
  }

  /**
   * Get a header from the request.
   */
  header(key: string): string | undefined {
    return this.nativeRequest.headers.get(key);
  }

  private _ip?: string;
  setIp(ip: any) {
    // Bun returns an object for requestIP, we should stringify it or take the address
    this._ip = typeof ip === 'object' ? ip.address : String(ip);
  }

  ip(): string | undefined {
    return this._ip;
  }
}
