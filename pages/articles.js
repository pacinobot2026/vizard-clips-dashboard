import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('draft');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [filter, category, sortBy]);

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams({ filter, category, sortBy });
      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setStats(data.stats || {});
      setCategories(data.categories || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => 
    searchTerm === '' || 
    (article.title && article.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApprove = async (articleId) => {
    try {
      await fetch('/api/articles/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId })
      });
      fetchArticles();
    } catch (err) {
      console.error('Error approving article:', err);
    }
  };

  const handleReject = async (articleId) => {
    try {
      await fetch('/api/articles/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId })
      });
      fetchArticles();
    } catch (err) {
      console.error('Error rejecting article:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
        <NavigationSidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Loading articles...
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D1423' }}>
      <NavigationSidebar />
      
      <main style={{ flex: 1, padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ 
              fontSize: '30px', 
              fontWeight: '700', 
              background: 'linear-gradient(to right, #22d3ee, #60a5fa, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '4px' 
            }}>
              Article Cue Board
            </h1>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Article review and publishing</p>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <StatCard 
              icon="📝" 
              count={stats.draft || 0} 
              label="Draft"
              active={filter === 'draft'}
              onClick={() => setFilter('draft')}
            />
            <StatCard 
              icon="✅" 
              count={stats.approved || 0} 
              label="Approved"
              active={filter === 'approved'}
              onClick={() => setFilter('approved')}
            />
            <StatCard 
              icon="🚀" 
              count={stats.published || 0} 
              label="Published"
              active={filter === 'published'}
              onClick={() => setFilter('published')}
            />
            <StatCard 
              icon="❌" 
              count={stats.rejected || 0} 
              label="Rejected"
              active={filter === 'rejected'}
              onClick={() => setFilter('rejected')}
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
                All Publications
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
              placeholder="🔍 Search articles..."
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

          {/* Articles Section */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(75, 85, 99, 0.5)'
          }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>
                📰 Articles
              </h2>
              <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                {filteredArticles.length} articles
              </div>
            </div>

            {filteredArticles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: '#6b7280' }}>
                {searchTerm ? `No articles matching "${searchTerm}"` : `No ${filter} articles`}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {filteredArticles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article}
                    onApprove={() => handleApprove(article.id)}
                    onReject={() => handleReject(article.id)}
                    showActions={filter === 'draft'}
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

function StatCard({ icon, count, label, active, onClick, style }) {
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

function ArticleCard({ article, onApprove, onReject, showActions }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      style={{
        background: 'rgba(31, 41, 55, 0.7)',
        borderRadius: '12px',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        overflow: 'hidden',
        transition: 'all 0.3s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Article Preview */}
      <div style={{ 
        aspectRatio: '4/5', 
        background: article.image_url ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
        transition: 'filter 0.3s ease'
      }}>
        {article.image_url ? (
          <img 
            src={article.image_url} 
            alt={article.title || 'Article preview'}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            color: 'white'
          }}>
            📰
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '8px', lineHeight: 1.4 }}>
          {article.title || 'Untitled Article'}
        </h3>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {article.publication && (
            <span style={{ 
              padding: '4px 8px', 
              background: '#1f2937', 
              borderRadius: '6px', 
              fontSize: '11px',
              color: '#9ca3af'
            }}>
              {article.publication}
            </span>
          )}
          {article.created_at && (
            <span style={{ 
              padding: '4px 8px', 
              background: '#1f2937', 
              borderRadius: '6px', 
              fontSize: '11px',
              color: '#9ca3af'
            }}>
              {new Date(article.created_at).toLocaleDateString()}
            </span>
          )}
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
