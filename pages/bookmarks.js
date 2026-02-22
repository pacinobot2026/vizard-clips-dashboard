import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('read-later');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadMockBookmarks();
  }, [filter, category, sortBy]);

  const loadMockBookmarks = () => {
    // Mock bookmarks data
    const mockBookmarks = [
      {
        id: 1,
        title: "How to Scale Local News Sites with AI",
        url: "https://example.com/scale-local-news",
        description: "Complete guide on using AI to generate local content and scale to multiple cities",
        category: "Articles",
        status: "read-later",
        tags: ["AI", "Local Media", "Scaling"],
        created_at: "2026-02-22T10:30:00Z"
      },
      {
        id: 2,
        title: "Vizard AI Video Clipping Tutorial",
        url: "https://vizard.ai/docs",
        description: "Official documentation for automating short-form video creation",
        category: "Resources",
        status: "read-later",
        tags: ["Video", "Automation", "Tutorial"],
        created_at: "2026-02-21T14:20:00Z"
      },
      {
        id: 3,
        title: "Best Practices for Email Marketing Automation",
        url: "https://example.com/email-automation",
        description: "Strategies for re-engagement campaigns and workflow automation",
        category: "Articles",
        status: "favorites",
        tags: ["Email", "Marketing", "Automation"],
        created_at: "2026-02-20T09:15:00Z"
      },
      {
        id: 4,
        title: "OpenClaw Documentation",
        url: "https://docs.openclaw.ai",
        description: "Full documentation for OpenClaw AI agent platform",
        category: "Tools",
        status: "favorites",
        tags: ["OpenClaw", "Documentation", "AI"],
        created_at: "2026-02-19T16:45:00Z"
      },
      {
        id: 5,
        title: "Local SEO Masterclass",
        url: "https://example.com/local-seo",
        description: "Advanced techniques for ranking local content in Google",
        category: "Videos",
        status: "read-later",
        tags: ["SEO", "Local", "Training"],
        created_at: "2026-02-18T12:30:00Z"
      },
      {
        id: 6,
        title: "Airtable API Integration Guide",
        url: "https://airtable.com/developers",
        description: "How to automate workflows with Airtable's REST API",
        category: "Resources",
        status: "archived",
        tags: ["Airtable", "API", "Integration"],
        created_at: "2026-02-15T11:00:00Z"
      }
    ];

    // Filter by status
    let filtered = mockBookmarks.filter(b => b.status === filter);

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(b => b.category === category);
    }

    // Sort
    if (sortBy === 'date_desc') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'date_asc') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Calculate stats
    const statsCalc = {
      'read-later': mockBookmarks.filter(b => b.status === 'read-later').length,
      favorites: mockBookmarks.filter(b => b.status === 'favorites').length,
      archived: mockBookmarks.filter(b => b.status === 'archived').length,
    };

    // Calculate categories
    const categoryMap = {};
    mockBookmarks.forEach(b => {
      if (!categoryMap[b.category]) {
        categoryMap[b.category] = 0;
      }
      categoryMap[b.category]++;
    });

    const categoriesCalc = Object.keys(categoryMap).map(name => ({
      name,
      count: categoryMap[name]
    }));

    setBookmarks(filtered);
    setStats(statsCalc);
    setCategories(categoriesCalc);
    setLoading(false);
  };

  const filteredBookmarks = bookmarks.filter(bookmark => 
    searchTerm === '' || 
    (bookmark.title && bookmark.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (bookmark.description && bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
        <NavigationSidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Loading bookmarks...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
      <NavigationSidebar />
      
      <main style={{ flex: 1, padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: '#0D1423', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Hamburger Menu - Top Right */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                  Boards
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
                <a href="/bookmarks" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)' }}>
                  <span style={{ fontSize: '20px' }}>📑</span>
                  <span style={{ fontSize: '14px' }}>Bookmarks</span>
                </a>
                <a href="/shopping" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🛒</span>
                  <span style={{ fontSize: '14px' }}>Shopping/Watch</span>
                </a>
                <a href="/projects" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                  <span style={{ fontSize: '20px' }}>📂</span>
                  <span style={{ fontSize: '14px' }}>Projects</span>
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
          <div style={{ marginBottom: '24px', animation: 'fadeIn 0.6s ease-out' }}>
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
              📑 Bookmarks
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Save and organize useful links</p>
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

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <StatCard 
              icon="📖" 
              count={stats['read-later'] || 0} 
              label="Read Later"
              active={filter === 'read-later'}
              onClick={() => setFilter('read-later')}
              delay={0}
            />
            <StatCard 
              icon="⭐" 
              count={stats.favorites || 0} 
              label="Favorites"
              active={filter === 'favorites'}
              onClick={() => setFilter('favorites')}
              delay={0.1}
            />
            <StatCard 
              icon="📦" 
              count={stats.archived || 0} 
              label="Archived"
              active={filter === 'archived'}
              onClick={() => setFilter('archived')}
              delay={0.2}
            />
          </div>

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
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          )}

          {/* Search and Sort */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search bookmarks..."
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
              <option value="title">Title</option>
            </select>
          </div>

          {/* Bookmarks Section */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            animation: 'scaleIn 0.4s ease-out 0.4s both'
          }}>
            {filteredBookmarks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: '#6b7280' }}>
                {searchTerm ? `No bookmarks matching "${searchTerm}"` : `No ${filter} bookmarks`}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '16px', textAlign: 'right', color: '#9ca3af', fontSize: '14px' }}>
            {filteredBookmarks.length} {filteredBookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, count, label, active, onClick, delay = 0 }) {
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
        animation: `slideUp 0.5s ease-out ${delay}s both`
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

function BookmarkCard({ bookmark }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      style={{
        background: 'rgba(31, 41, 55, 0.7)',
        borderRadius: '12px',
        border: `1px solid ${isHovered ? 'rgba(139, 92, 246, 0.5)' : 'rgba(75, 85, 99, 0.5)'}`,
        padding: '16px',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? '0 8px 16px rgba(139, 92, 246, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        transform: isHovered ? 'translateY(-4px)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a 
        href={bookmark.url} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          color: isHovered ? '#60a5fa' : '#fff', 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '8px', 
          display: 'block',
          textDecoration: 'none',
          lineHeight: 1.4,
          transition: 'color 0.2s'
        }}
      >
        {bookmark.title}
      </a>
      
      <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '12px', lineHeight: 1.5 }}>
        {bookmark.description}
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span style={{ 
          padding: '4px 8px', 
          background: '#1f2937', 
          borderRadius: '6px', 
          fontSize: '11px',
          color: '#9ca3af'
        }}>
          {bookmark.category}
        </span>
        <span style={{ 
          padding: '4px 8px', 
          background: '#1f2937', 
          borderRadius: '6px', 
          fontSize: '11px',
          color: '#9ca3af'
        }}>
          {new Date(bookmark.created_at).toLocaleDateString()}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {bookmark.tags.map(tag => (
          <span 
            key={tag}
            style={{
              padding: '2px 8px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#a78bfa'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
