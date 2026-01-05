import React from 'react';
import Layout from './Layout';
import { Link } from '../js/router';

export default function Home() {
    return (
        <div style={{ textAlign: 'center', marginTop: '120px' }}>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#000', letterSpacing: '-0.05em', marginBottom: '1rem' }}>
                Bullet<span style={{ color: '#FF3E00' }}>JS</span>
            </h1>
            <p style={{ fontSize: '1.5rem', color: '#666', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: '1.5' }}>
                The lightning-fast full-stack framework for <span style={{ color: '#000', fontWeight: 'bold' }}>Bun</span>.
                Build premium applications without the overhead.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                <Link href="/register" style={{
                    padding: '1rem 2.5rem',
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)'
                }}>
                    Get Started
                </Link>
                <Link href="/login" style={{
                    padding: '1rem 2.5rem',
                    border: '2px solid #eee',
                    color: '#333',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '1.1rem'
                }}>
                    Sign In
                </Link>
            </div>

            <div style={{ marginTop: '5rem', color: '#aaa', fontSize: '0.9rem' }}>
                <p>Proudly powered by Bun & React</p>
            </div>
        </div>
    );
}

// Persistent Layout
Home.layout = (page: any) => <Layout>{page}</Layout>;
