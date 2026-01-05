import React, { createContext, useContext, useState, useEffect } from 'react';

export const RouterContext = createContext<any>({ navigate: () => { } });

export function Link({ href, children, style, className }: any) {
    const { navigate } = useContext(RouterContext);

    return (
        <a
            href={href}
            className={className}
            style={style}
            onClick={(e) => {
                e.preventDefault();
                if (navigate) {
                    navigate(href);
                } else {
                    window.location.href = href;
                }
            }}
        >
            {children}
        </a>
    );
}

export function App({ initialPage, initialProps, pages }: any) {
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
        try {
            const res = await fetch(url, {
                headers: {
                    'X-Bullet-Inertia': 'true'
                }
            });

            if (res.ok) {
                const data = await res.json();
                const { component, props: newProps } = data;

                // Update history
                window.history.pushState({ page: component, props: newProps }, '', url);

                // Transition
                setPage(component);
                setProps(newProps);
            } else {
                window.location.href = url;
            }
        } catch (e) {
            window.location.href = url;
        }
    };

    const PageComponent = pages[page] || (() => <div>Page not found: {page}</div>);

    // Check if component has a persistent layout defined
    // @ts-ignore
    const renderPage = (Page: any, p: any) => {
        if (Page.layout) {
            return Page.layout(<Page {...p} />);
        }
        return <Page {...p} />;
    };

    return (
        <RouterContext.Provider value={{ navigate }}>
            {renderPage(PageComponent, props)}
        </RouterContext.Provider>
    );
}
