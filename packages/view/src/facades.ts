import type { ViewFactory } from './view';

// This facade is dangerous for the browser bundle if imported eagerly.
// We must ensure it's not side-effectful at the top level.

let instance: ViewFactory;

export const View = new Proxy({}, {
    get: (_, prop) => {
        if (!instance) {
             const { ViewFactory } = require('./view');
             const path = require('path');
             instance = new ViewFactory(path.join(process.cwd(), 'resources', 'views'));
        }
        // @ts-ignore
        return instance[prop];
    }
}) as ViewFactory;
