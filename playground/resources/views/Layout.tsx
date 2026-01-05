import React from 'react';
import { Link } from '../js/router';

export default function Layout({ children }: any) {
    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', color: '#333' }}>
            <nav style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: '#000' }}>BulletJS</Link>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link href="/login" style={{ textDecoration: 'none', color: '#666' }}>Login</Link>
                    <Link href="/register" style={{ textDecoration: 'none', color: '#666' }}>Register</Link>
                </div>
            </nav>

            <main>
                {children}
            </main>
        </div>
    );
}
