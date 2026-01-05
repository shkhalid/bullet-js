import React from 'react';
import { Link } from '../../js/router';

export default function NotFound() {
    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', color: '#333', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <nav style={{
                padding: '1rem 2rem',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: '#000' }}>BulletJS</Link>
                </div>
            </nav>

            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <h1 style={{ fontSize: '6rem', fontWeight: '900', color: '#000', letterSpacing: '-0.05em', marginBottom: '0', lineHeight: 1 }}>
                    404
                </h1>
                <p style={{ fontSize: '1.5rem', color: '#666', maxWidth: '600px', margin: '1rem auto 3rem auto', lineHeight: '1.5' }}>
                    Page Not Found
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                    <Link href="/" style={{
                        padding: '1rem 2.5rem',
                        backgroundColor: '#000',
                        color: '#fff',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)'
                    }}>
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
