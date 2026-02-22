import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Dashboard() {
  const [clips, setClips] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [processingCount, setProcessingCount] = useState(0);
  const [nextCheckIn, setNextCheckIn] = useState(300); // 5 minutes in seconds
  const [nextPostIn, setNextPostIn] = useState(7200); // 2 hours in seconds (default)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchClips();
  }, [filter, category, sortBy]);
  
  useEffect(() => {
    fetchProcessing();
    
    // Check processing every 5 minutes
    const processingInterval = setInterval(fetchProcessing, 5 * 60 * 1000);
    
    // Countdown timers (updates every second)
    const countdownInterval = setInterval(() => {
      // Processing check countdown
      setNextCheckIn(prev => {
        if (prev <= 1) {
          return 300; // Reset to 5 minutes
        }
        return prev - 1;
      });
      
      // Social posting countdown
      setNextPostIn(prev => {
        if (prev <= 1) {
          return 7200; // Reset to 2 hours
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(processingInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const fetchProcessing = async () => {
    try {
      const res = await fetch('/api/processing');
      const data = await res.json();
      setProcessingCount(data.processing || 0);
      setNextCheckIn(300); // Reset countdown on fetch
    } catch (err) {
      console.error('Error fetching processing count:', err);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatLongTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const fetchClips = async () => {
    try {
      const params = new URLSearchParams({ filter, category, sortBy });
      const res = await fetch(`/api/clips?${params}`);
      const data = await res.json();
      setClips(data.clips);
      setStats(data.stats);
      setCategories(data.categories || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching clips:', err);
      setLoading(false);
    }
  };

  const filteredClips = clips.filter(clip => 
    searchTerm === '' || 
    (clip.title && clip.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApprove = async (clipId) => {
    try {
      await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId })
      });
      fetchClips();
    } catch (err) {
      console.error('Error approving clip:', err);
    }
  };

  const handleReject = async (clipId) => {
    try {
      await fetch('/api/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId })
      });
      fetchClips();
    } catch (err) {
      console.error('Error rejecting clip:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
        <NavigationSidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Loading clips...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
      <NavigationSidebar />
      
      <main style={{ flex: 1, padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0D1423', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
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
                <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)' }}>
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
                <a href="/openclaw" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
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
              Video Cue Board
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Video clip review and publishing</p>
          </div>

          {/* Status Banner - Always visible */}
          <div style={{
            background: 'rgba(75, 85, 99, 0.1)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            borderRadius: '12px',
            padding: '12px 20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'slideUp 0.5s ease-out 0.2s both',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Processing Status */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              background: processingCount > 0 ? 'rgba(167, 139, 250, 0.1)' : 'transparent',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                fontSize: '24px',
                animation: processingCount > 0 ? 'spin 2s linear infinite' : 'pulse 2s ease-in-out infinite',
                filter: processingCount > 0 ? 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.6))' : 'none'
              }}>⚙️</div>
              <div>
                <div style={{ 
                  color: processingCount > 0 ? '#a78bfa' : '#9ca3af', 
                  fontSize: '13px', 
                  fontWeight: '600',
                  animation: processingCount > 0 ? 'pulse 2s ease-in-out infinite' : 'none'
                }}>
                  {processingCount > 0 
                    ? `${processingCount} video${processingCount > 1 ? 's' : ''} being edited`
                    : 'No videos processing'
                  }
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>
                  Next check: {formatTime(nextCheckIn)}
                </div>
              </div>
            </div>
            
            {/* Separator */}
            <div style={{ 
              width: '1px', 
              height: '40px', 
              background: 'linear-gradient(180deg, rgba(139, 92, 246, 0) 0%, rgba(139, 92, 246, 0.5) 50%, rgba(139, 92, 246, 0) 100%)',
              animation: 'pulse 3s ease-in-out infinite'
            }}></div>
            
            {/* Social Posting Timer */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              background: stats.approved > 0 ? 'rgba(96, 165, 250, 0.1)' : 'transparent',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                fontSize: '24px',
                animation: stats.approved > 0 ? 'pulse 2s ease-in-out infinite' : 'none',
                filter: stats.approved > 0 ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.6))' : 'none'
              }}>🚀</div>
              <div>
                <div style={{ 
                  color: '#60a5fa', 
                  fontSize: '13px', 
                  fontWeight: '600',
                  animation: stats.approved > 0 ? 'pulse 2s ease-in-out infinite' : 'none'
                }}>
                  Next social post
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>
                  {stats.approved > 0 
                    ? `In ${formatLongTime(nextPostIn)} (automated)`
                    : 'No approved clips ready'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <StatCard 
              icon="⏳" 
              count={stats.pending || 0} 
              label="Pending"
              active={filter === 'pending'}
              onClick={() => setFilter('pending')}
              delay={0}
            />
            <StatCard 
              icon="✅" 
              count={stats.approved || 0} 
              label="Approved"
              active={filter === 'approved'}
              onClick={() => setFilter('approved')}
              delay={0.1}
            />
            <StatCard 
              icon="🚀" 
              count={stats.published || 0} 
              label="Published"
              active={filter === 'published'}
              onClick={() => setFilter('published')}
              delay={0.2}
            />
            <StatCard 
              icon="❌" 
              count={stats.rejected || 0} 
              label="Rejected"
              active={filter === 'rejected'}
              onClick={() => setFilter('rejected')}
              delay={0.3}
            />
          </div>
          
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            @keyframes glow {
              0%, 100% { filter: brightness(1); }
              50% { filter: brightness(1.3); }
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
              /* Stat cards - 2 columns on mobile */
              div[style*="gridTemplateColumns: 'repeat(4, 1fr)'"] {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
              }
              /* Search/filter row - stack vertically */
              div[style*="flexWrap: 'wrap'"] {
                flex-direction: column !important;
              }
              /* Card grids - 2 columns on mobile */
              div[style*="repeat(auto-fill"] {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}</style>

          {/* Categories */}
          {categories.length > 0 && (
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setCategory('all')}
                style={{
                  padding: '8px 16px',
                  background: category === 'all' ? '#8b5cf6' : 'rgba(31, 41, 55, 0.5)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  style={{
                    padding: '8px 16px',
                    background: category === cat.name ? '#8b5cf6' : 'rgba(31, 41, 55, 0.5)',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.emoji} {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          )}

          {/* Search and Filters */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search clips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '10px 16px',
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 16px',
                background: 'rgba(31, 41, 55, 0.5)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="viral_score">Viral Score</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          {/* Clips Section - in a box like Control Panel */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            animation: 'scaleIn 0.4s ease-out 0.4s both'
          }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>
                📹 Video Clips
              </h2>
              <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                {filteredClips.length} clips
              </div>
            </div>

            {filteredClips.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: '#6b7280' }}>
                {searchTerm ? `No clips matching "${searchTerm}"` : `No ${filter} clips`}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {filteredClips.map((clip) => (
                  <ClipCard 
                    key={clip.clip_id} 
                    clip={clip}
                    onApprove={() => handleApprove(clip.clip_id)}
                    onReject={() => handleReject(clip.clip_id)}
                    showActions={filter === 'pending'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, count, label, active, onClick, delay = 0, style }) {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '16px',
        background: active ? '#8b5cf6' : 'rgba(31, 41, 55, 0.5)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        border: `1px solid ${active ? '#8b5cf6' : 'rgba(75, 85, 99, 0.5)'}`,
        transform: active ? 'scale(1.05)' : 'none',
        animation: `slideUp 0.5s ease-out ${delay}s both`,
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '28px' }}>{icon}</div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: active ? '#fff' : '#06b6d4', lineHeight: 1, marginBottom: '4px' }}>
            {count}
          </div>
          <div style={{ fontSize: '12px', color: active ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClipCard({ clip, onApprove, onReject, showActions }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      style={{
        background: 'rgba(31, 41, 55, 0.7)',
        borderRadius: '12px',
        border: `1px solid ${isHovered ? 'rgba(139, 92, 246, 0.5)' : 'rgba(75, 85, 99, 0.5)'}`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? '0 8px 16px rgba(139, 92, 246, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-4px)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Player */}
      <div style={{ 
        aspectRatio: '4/5', 
        background: '#000',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {clip.clip_url ? (
          <video 
            src={clip.clip_url}
            controls
            preload="metadata"
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: 'white'
          }}>
            ▶
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '8px', lineHeight: 1.4 }}>
          {clip.title || 'Untitled Clip'}
        </h3>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ 
            padding: '4px 8px', 
            background: '#1f2937', 
            borderRadius: '6px', 
            fontSize: '11px',
            color: '#9ca3af'
          }}>
            {clip.viral_score || 0}/10
          </span>
          <span style={{ 
            padding: '4px 8px', 
            background: '#1f2937', 
            borderRadius: '6px', 
            fontSize: '11px',
            color: '#9ca3af'
          }}>
            {clip.duration || '0s'}
          </span>
        </div>

        {showActions && isHovered && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onApprove}
              style={{
                flex: 1,
                padding: '8px',
                background: '#10b981',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ✓ Approve
            </button>
            <button
              onClick={onReject}
              style={{
                flex: 1,
                padding: '8px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
