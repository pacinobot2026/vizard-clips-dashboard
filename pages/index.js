import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎬 Vizard Clips Dashboard</h1>
        <p style={styles.subtitle}>Enter password to access</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoFocus
          />
          
          {error && <p style={styles.error}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  card: {
    background: '#1a202c',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '8px',
    color: '#f7fafc'
  },
  subtitle: {
    textAlign: 'center',
    color: '#a0aec0',
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    padding: '14px 16px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border 0.2s',
    outline: 'none'
  },
  button: {
    padding: '14px',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, opacity 0.2s'
  },
  error: {
    color: '#e53e3e',
    fontSize: '14px',
    textAlign: 'center',
    margin: '0'
  }
};
