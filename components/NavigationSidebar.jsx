import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'video', label: 'Video Board', icon: '🎬', href: '/dashboard' },
  { id: 'articles', label: 'Article Board', icon: '📰', href: '/articles' },
  { id: 'ideas', label: 'Idea Board', icon: '💡', href: '/ideas' },
  { id: 'control', label: 'Command Center', icon: '🎛️', href: 'https://dashboard-gilt-one-zc4y5uu95v.vercel.app' },
  { id: 'team', label: 'Team Board', icon: '👥', href: 'https://kanban-rho-ivory.vercel.app' },
  { id: 'openclaw', label: 'OpenClaw Board', icon: '🤖', href: '/openclaw' },
];

export default function NavigationSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '8px',
          padding: '12px',
          color: '#fff',
          cursor: 'pointer',
          display: 'none'
        }}
        className="mobile-menu-btn"
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'none'
          }}
          className="mobile-overlay"
        />
      )}

      <div 
        className={`min-h-screen h-full bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-48' : 'w-14'
        } ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        style={{ minHeight: '100vh', background: '#111827', borderRight: '1px solid #1f2937' }}
      >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '12px',
          color: '#9ca3af',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
      >
        <svg 
          style={{ width: '20px', height: '20px', transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>

      {/* Nav Items */}
      <nav style={{ flex: 1, paddingTop: '16px', paddingBottom: '16px' }}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              color: '#d1d5db',
              textDecoration: 'none',
              transition: 'background 0.2s, color 0.2s',
              background: currentPath === item.href ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
              borderRight: currentPath === item.href ? '2px solid #8b5cf6' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1f2937';
              e.currentTarget.style.color = '#fff';
              setHoveredItem(item.id);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = currentPath === item.href ? 'rgba(139, 92, 246, 0.1)' : 'transparent';
              e.currentTarget.style.color = '#d1d5db';
              setHoveredItem(null);
            }}
          >
            {/* Icon */}
            <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
            
            {/* Label - shown when expanded */}
            {isExpanded && (
              <span style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {item.label}
              </span>
            )}

            {/* Tooltip - shown when collapsed and hovered */}
            {!isExpanded && hoveredItem === item.id && (
              <div style={{
                position: 'absolute',
                left: '100%',
                marginLeft: '8px',
                padding: '8px 12px',
                background: '#1f2937',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                zIndex: 50,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #374151'
              }}>
                {item.label}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translate(-4px, -50%)',
                  width: 0,
                  height: 0,
                  borderTop: '4px solid transparent',
                  borderBottom: '4px solid transparent',
                  borderRight: '4px solid #1f2937'
                }} />
              </div>
            )}
          </a>
        ))}
      </nav>

        {/* Logo/Bottom */}
        <div style={{ padding: '12px', borderTop: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>🎬</span>
            {isExpanded && (
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden' }}>Pacino</span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .mobile-overlay {
            display: block !important;
          }
          div:not(.mobile-menu-btn):not(.mobile-overlay) {
            position: fixed;
            left: -100%;
            top: 0;
            width: 240px !important;
            transition: left 0.3s ease;
            z-index: 1000;
          }
          .mobile-menu-open {
            left: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
