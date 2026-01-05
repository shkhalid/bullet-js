import React from 'react';
import Layout from '../Layout';

export default function Register() {
    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #eee', borderRadius: '8px' }}>
            <h1 style={{ textAlign: 'center' }}>Register</h1>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Name" style={{ padding: '0.5rem' }} />
                <input type="email" placeholder="Email" style={{ padding: '0.5rem' }} />
                <input type="password" placeholder="Password" style={{ padding: '0.5rem' }} />
                <button style={{ padding: '0.5rem', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Create Account
                </button>
            </form>
        </div>
    );
}

Register.layout = (page: any) => <Layout>{page}</Layout>;
