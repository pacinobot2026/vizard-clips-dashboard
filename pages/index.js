import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to dashboard (password protection removed)
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Redirecting to dashboard...</div>
    </div>
  );
}
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
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    backgroundAttachment: 'fixed',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif'
  },
  card: {
    background: 'rgba(26, 32, 44, 0.8)',
    backdropFilter: 'blur(20px)',
    padding: '48px',
    borderRadius: '24px',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    textAlign: 'center',
    color: '#cbd5e0',
    marginBottom: '36px',
    fontSize: '15px'
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
