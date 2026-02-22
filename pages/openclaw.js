import React, { useState } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';

export default function OpenClaw() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
      <NavigationSidebar />
      
      <main style={{ flex: 1, padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0D1423', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Hamburger Menu - Top Right */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hamburger-menu"
            style={{
              position: 'fixed',
              top: '16px',
              right: '16px',
              zIndex: 1001,
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Publications Menu Dropdown */}
          {mobileMenuOpen && (
            <>
              <div
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 999
                }}
              />
              <div style={{
                position: 'fixed',
                top: '72px',
                right: '16px',
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                padding: '8px',
                zIndex: 1000,
                minWidth: '200px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{ padding: '8px 12px', color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                  Publications
                </div>
                <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🎬</span>
                  <span style={{ fontSize: '14px' }}>Video Board</span>
                </a>
                <a href="/articles" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📰</span>
                  <span style={{ fontSize: '14px' }}>Article Board</span>
                </a>
                <a href="/ideas" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>💡</span>
                  <span style={{ fontSize: '14px' }}>Idea Board</span>
                </a>
                <div style={{ height: '1px', background: '#374151', margin: '8px 0' }} />
                <a href="https://dashboard-gilt-one-zc4y5uu95v.vercel.app" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🎛️</span>
                  <span style={{ fontSize: '14px' }}>Command Center</span>
                </a>
                <a href="https://kanban-rho-ivory.vercel.app" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>👥</span>
                  <span style={{ fontSize: '14px' }}>Team Board</span>
                </a>
                <a href="/openclaw" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)' }}>
                  <span style={{ fontSize: '20px' }}>🤖</span>
                  <span style={{ fontSize: '14px' }}>OpenClaw Board</span>
                </a>
              </div>
            </>
          )}
          
          {/* Header */}
          <div style={{ 
            marginBottom: '24px',
            animation: 'fadeIn 0.6s ease-out'
          }}>
            <h1 style={{ 
              fontSize: '30px', 
              fontWeight: '700', 
              background: 'linear-gradient(90deg, #22d3ee, #60a5fa, #a78bfa, #22d3ee)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '4px',
              animation: 'gradientShift 3s ease infinite'
            }}>
              🤖 OpenClaw Board
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>OpenClaw automation dashboard</p>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
              main {
                padding: 16px !important;
                padding-top: 64px !important;
              }
              h1 {
                font-size: 24px !important;
              }
            }
          `}</style>

          {/* Content */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.5)',
            borderRadius: '16px',
            padding: '48px',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🤖</div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>
              OpenClaw Dashboard Coming Soon
            </h2>
            <p style={{ fontSize: '16px', color: '#9ca3af' }}>
              This board will show OpenClaw automations, cron jobs, and system status.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
