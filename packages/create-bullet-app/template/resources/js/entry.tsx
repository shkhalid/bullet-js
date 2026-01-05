import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './router';
import { PAGES } from './pages';

// Hydration entry point
const initialData = (window as any).__INITIAL_DATA__;

if (initialData) {
    hydrateRoot(
        document.getElementById('root')!,
        <App initialPage={initialData.component} initialProps={initialData.props} pages={PAGES} />
    );
}
