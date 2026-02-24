import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'video', label: 'Video Board', icon: '🎬', href: '/dashboard' },
  { id: 'articles', label: 'Article Board', icon: '📰', href: '/articles' },
  { id: 'vault', label: 'Operator Vault', icon: '🔐', href: '/vault' },
  { id: 'ideas', label: 'Idea Board', icon: '💡', href: '/ideas' },
  { id: 'bookmarks', label: 'Bookmarks', icon: '📑', href: '/bookmarks' },
  { id: 'shopping', label: 'Shopping/Watch', icon: '🛒', href: '/shopping' },
  { id: 'projects', label: 'Projects', icon: '📂', href: '/projects' },
  { id: 'control', label: 'Command Center', icon: '🎛️', href: 'https://dashboard-gilt-one-zc4y5uu95v.vercel.app' },
  { id: 'team', label: 'Team Board', icon: '👥', href: 'https://kanban-rho-ivory.vercel.app' },
  { id: 'openclaw', label: 'OpenClaw Board', icon: '🤖', href: '/openclaw' },
];

export default function NavigationSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const showLabel = isMobile || isExpanded;

  return (
    <>
      {/* Mobile Hamburger Button - Top Right */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 right-4 z-40 p-2 bg-gray-900 border border-gray-800 rounded-lg"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`${isMobile ? 'fixed' : 'static'} ${isMobile && !isMobileMenuOpen ? '-right-64' : 'right-0'} min-h-screen bg-gray-900 ${isMobile ? 'border-l' : 'border-r'} border-gray-800 flex flex-col z-50 transition-all duration-300`}
        style={{ 
          minHeight: '100vh', 
          background: '#111827',
          width: isMobile ? '256px' : (isExpanded ? '192px' : '56px')
        }}
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
      >
        {/* Header with Close Button (Mobile only) */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎬</span>
              <span className="text-white font-bold">Menu</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Nav Items */}
        <nav style={{ flex: 1, paddingTop: '16px', paddingBottom: '16px' }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
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
              
              {/* Label - show when mobile OR expanded on desktop */}
              {showLabel && (
                <span style={{ fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {item.label}
                </span>
              )}

              {/* Tooltip - ONLY on desktop when collapsed and hovered */}
              {!isMobile && !isExpanded && hoveredItem === item.id && (
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
            {showLabel && (
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden' }}>Pacino</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
