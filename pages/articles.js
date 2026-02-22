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
    loadMockArticles();
  }, [filter, category, sortBy]);

  const loadMockArticles = () => {
    // Mock article data
    const mockArticles = [
      {
        id: 1,
        title: "Local Business Spotlight: New Italian Restaurant Opens in Summerlin",
        publication: "West Valley Shoutouts",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=500&fit=crop",
        created_at: "2026-02-20T10:30:00Z"
      },
      {
        id: 2,
        title: "Community Hero: Vegas Teacher Launches After-School STEM Program",
        publication: "West Valley Shoutouts",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=500&fit=crop",
        created_at: "2026-02-21T14:20:00Z"
      },
      {
        id: 3,
        title: "Rescue Dog Finds Forever Home After 2 Years at Shelter",
        publication: "Save The Doggy",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=500&fit=crop",
        created_at: "2026-02-21T09:15:00Z"
      },
      {
        id: 4,
        title: "Best Tacos in Vegas: Hidden Gem in Henderson Wins Hearts",
        publication: "Vegas Fork",
        status: "approved",
        image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=500&fit=crop",
        created_at: "2026-02-19T16:45:00Z"
      },
      {
        id: 5,
        title: "Local Animal Shelter Hosts Adoption Event This Weekend",
        publication: "Save The Doggy",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=500&fit=crop",
        created_at: "2026-02-22T08:00:00Z"
      },
      {
        id: 6,
        title: "Downtown Las Vegas Adds New Food Truck Park",
        publication: "Vegas Fork",
        status: "published",
        image_url: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=400&h=500&fit=crop",
        created_at: "2026-02-18T12:30:00Z"
      },
      {
        id: 7,
        title: "Henderson Chamber of Commerce Announces Small Business Awards",
        publication: "West Valley Shoutouts",
        status: "approved",
        image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=500&fit=crop",
        created_at: "2026-02-20T11:00:00Z"
      },
      {
        id: 8,
        title: "Senior Dog Adoption Drive: Finding Homes for Older Pups",
        publication: "Save The Doggy",
        status: "rejected",
        image_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=500&fit=crop",
        created_at: "2026-02-17T15:20:00Z"
      },
      {
        id: 9,
        title: "Top 10 Brunch Spots on the Strip You Need to Try",
        publication: "Vegas Fork",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=500&fit=crop",
        created_at: "2026-02-21T07:45:00Z"
      },
      {
        id: 10,
        title: "Local Entrepreneur Opens Third Coffee Shop in Green Valley",
        publication: "West Valley Shoutouts",
        status: "published",
        image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=500&fit=crop",
        created_at: "2026-02-16T13:10:00Z"
      },
      {
        id: 11,
        title: "Vegas Dog Park Renovation Complete: New Features Unveiled",
        publication: "Save The Doggy",
        status: "approved",
        image_url: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&h=500&fit=crop",
        created_at: "2026-02-19T10:30:00Z"
      },
      {
        id: 12,
        title: "Celebrity Chef Opens Farm-to-Table Restaurant in Summerlin",
        publication: "Vegas Fork",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=500&fit=crop",
        created_at: "2026-02-22T09:20:00Z"
      }
    ];

    // Filter by status
    let filtered = mockArticles.filter(a => a.status === filter);

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(a => a.publication === category);
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
      draft: mockArticles.filter(a => a.status === 'draft').length,
      approved: mockArticles.filter(a => a.status === 'approved').length,
      published: mockArticles.filter(a => a.status === 'published').length,
      rejected: mockArticles.filter(a => a.status === 'rejected').length
    };

    // Calculate categories
    const categoryMap = {};
    mockArticles.forEach(a => {
      if (!categoryMap[a.publication]) {
        categoryMap[a.publication] = 0;
      }
      categoryMap[a.publication]++;
    });

    const categoriesCalc = Object.keys(categoryMap).map(name => {
      let emoji = '📍';
      if (name === 'Save The Doggy') emoji = '🐕';
      if (name === 'Vegas Fork') emoji = '🍴';
      
      return {
        name,
        emoji,
        count: categoryMap[name]
      };
    });

    setArticles(filtered);
    setStats(statsCalc);
    setCategories(categoriesCalc);
    setLoading(false);
  };

  const filteredArticles = articles.filter(article => 
    searchTerm === '' || 
    (article.title && article.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApprove = (articleId) => {
    // Mock approve - just refresh (would update status in real app)
    console.log('Approved article:', articleId);
    loadMockArticles();
  };

  const handleReject = (articleId) => {
    // Mock reject - just refresh (would update status in real app)
    console.log('Rejected article:', articleId);
    loadMockArticles();
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
