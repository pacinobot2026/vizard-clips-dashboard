import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to dashboard (password protection removed)
    router.push('/dashboard');
  }, [router]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎬 Vizard Clips Dashboard</h1>
        <p style={styles.subtitle}>Redirecting to dashboard...</p>
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
  }
};
