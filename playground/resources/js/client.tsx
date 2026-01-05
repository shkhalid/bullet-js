import React, { createContext, useContext, useState, useEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';

// Map of all page components
// In a real build system, this would be auto-generated
import Home from '../views/Home';
import About from '../views/About';
import Contact from '../views/Contact';

const PAGES: Record<string, any> = {
    'Home': Home,
    'About': About,
    'Contact': Contact
};

const RouterContext = createContext<any>(null);

export function Link({ href, children, className }: any) {
    const { navigate } = useContext(RouterContext);

    return (
        <a
            href={href}
            className={className}
            onClick={(e) => {
                e.preventDefault();
                navigate(href);
            }}
        >
            {children}
        </a>
    );
}

function App({ initialPage, initialProps }: any) {
    const [page, setPage] = useState(initialPage);
    const [props, setProps] = useState(initialProps);

    useEffect(() => {
        window.onpopstate = (event) => {
            if (event.state) {
                setPage(event.state.page);
                setProps(event.state.props);
            }
        };
    }, []);

    const navigate = async (url: string) => {
        // 1. Push State
        // 2. Fetch data

        try {
            const res = await fetch(url, {
                headers: {
                    'X-Bullet-Inertia': 'true'
                }
            });

            if (res.ok) {
                const data = await res.json();
                // data should return { component: 'About', props: {...} }

                const { component, props } = data;

                window.history.pushState({ page: component, props }, '', url);
                setPage(component);
                setProps(props);
            } else {
                // Fallback to hard reload if fetch fails (e.g. 404/500)
                window.location.href = url;
            }
        } catch (e) {
            window.location.href = url;
        }
    };

    const PageComponent = PAGES[page] || (() => <div>Page not found: {page}</div>);

    return (
        <RouterContext.Provider value={{ navigate }}>
            <PageComponent {...props} />
        </RouterContext.Provider>
    );
}

// Hydration
const initialData = (window as any).__INITIAL_DATA__;

hydrateRoot(
    document.getElementById('root')!,
    <App initialPage={initialData.component} initialProps={initialData.props} />
);
