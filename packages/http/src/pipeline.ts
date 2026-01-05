export type NextFunction = () => Promise<Response | any>;
export type MiddlewareHandler = (req: any, next: NextFunction) => Promise<Response | any>;

export class Pipeline {
    private middlewares: MiddlewareHandler[] = [];

    use(middleware: MiddlewareHandler) {
        this.middlewares.push(middleware);
        return this;
    }

    async execute(context: any, finalHandler: () => Promise<any>): Promise<any> {
        let index = -1;

        const runner = async (i: number): Promise<any> => {
            if (i <= index) throw new Error('next() called multiple times');
            index = i;

            if (i === this.middlewares.length) {
                return await finalHandler();
            }

            const middleware = this.middlewares[i];
            
            return await middleware(context, async () => {
                return await runner(i + 1);
            });
        };

        return await runner(0);
    }
}
