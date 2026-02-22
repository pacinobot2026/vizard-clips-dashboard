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
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'cards'
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

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
        image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop",
        created_at: "2026-02-20T10:30:00Z",
        scrapable: true,
        content: "A new Italian restaurant, Bella Vita Trattoria, has opened its doors in the heart of Summerlin. The family-owned establishment brings authentic Italian cuisine to the neighborhood, featuring handmade pasta, wood-fired pizzas, and traditional recipes passed down through generations. Owner Marco Rossi says the restaurant aims to create a warm, welcoming atmosphere where families can gather for memorable meals."
      },
      {
        id: 2,
        title: "Community Hero: Vegas Teacher Launches After-School STEM Program",
        publication: "West Valley Shoutouts",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&h=80&fit=crop",
        created_at: "2026-02-21T14:20:00Z",
        scrapable: false,
        content: "Ms. Sarah Chen, a science teacher at Green Valley High School, has launched an innovative after-school STEM program for underserved students. The program provides free robotics, coding, and engineering workshops three times a week. With support from local tech companies, students gain hands-on experience with cutting-edge technology and mentorship from industry professionals."
      },
      {
        id: 3,
        title: "Rescue Dog Finds Forever Home After 2 Years at Shelter",
        publication: "Save The Doggy",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=80&h=80&fit=crop",
        created_at: "2026-02-21T09:15:00Z",
        scrapable: true,
        content: "Max, a 5-year-old golden retriever mix, has finally found his forever home after spending nearly two years at the Henderson Animal Shelter. The sweet-natured pup was adopted by the Johnson family, who fell in love with his gentle personality and playful spirit. Shelter staff say this heartwarming adoption shows that older dogs deserve a second chance too."
      },
      {
        id: 4,
        title: "Best Tacos in Vegas: Hidden Gem in Henderson Wins Hearts",
        publication: "Vegas Fork",
        status: "approved",
        image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=80&h=80&fit=crop",
        created_at: "2026-02-19T16:45:00Z",
        scrapable: true,
        content: "Tucked away in a Henderson strip mall, Taqueria El Comal is earning rave reviews for its authentic street tacos. Using family recipes from Jalisco, owner Carlos Martinez serves up perfectly seasoned carne asada, al pastor, and carnitas on fresh handmade tortillas. Locals say it's the best Mexican food in the valley—and the prices can't be beat."
      },
      {
        id: 5,
        title: "Local Animal Shelter Hosts Adoption Event This Weekend",
        publication: "Save The Doggy",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=80&h=80&fit=crop",
        created_at: "2026-02-22T08:00:00Z",
        scrapable: true,
        content: "The Animal Foundation will host a special adoption event this Saturday from 10 AM to 4 PM. All adoption fees are waived for dogs and cats over one year old. The shelter currently has over 200 animals looking for homes, including many loving senior pets. Volunteers will be on hand to help families find their perfect match."
      },
      {
        id: 6,
        title: "Downtown Las Vegas Adds New Food Truck Park",
        publication: "Vegas Fork",
        status: "published",
        image_url: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=80&h=80&fit=crop",
        created_at: "2026-02-18T12:30:00Z",
        scrapable: false,
        content: "Downtown Las Vegas Container Park has expanded with a new food truck area featuring rotating vendors every weekend. The space includes covered seating, live music, and a curated selection of local food trucks serving everything from Korean BBQ to gourmet grilled cheese. Open Friday through Sunday, 4 PM to midnight."
      },
      {
        id: 7,
        title: "Henderson Chamber of Commerce Announces Small Business Awards",
        publication: "West Valley Shoutouts",
        status: "approved",
        image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=80&h=80&fit=crop",
        created_at: "2026-02-20T11:00:00Z",
        scrapable: true,
        content: "The Henderson Chamber of Commerce has announced nominees for its annual Small Business Excellence Awards. Categories include Innovation, Customer Service, and Community Impact. Winners will be revealed at a gala dinner on March 15th at the M Resort. Over 50 local businesses have been nominated this year."
      },
      {
        id: 8,
        title: "Senior Dog Adoption Drive: Finding Homes for Older Pups",
        publication: "Save The Doggy",
        status: "rejected",
        image_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=80&h=80&fit=crop",
        created_at: "2026-02-17T15:20:00Z",
        scrapable: false,
        content: "Local rescue groups are partnering for a month-long campaign to find homes for senior dogs. Adopters receive a free veterinary checkup, supplies starter kit, and ongoing support from experienced volunteers. Senior dogs make wonderful companions and often require less training than puppies."
      },
      {
        id: 9,
        title: "Top 10 Brunch Spots on the Strip You Need to Try",
        publication: "Vegas Fork",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=80&h=80&fit=crop",
        created_at: "2026-02-21T07:45:00Z",
        scrapable: true,
        content: "From bottomless mimosas to decadent French toast, the Las Vegas Strip has become a brunch destination. Our top picks include Bouchon at The Venetian for classic French fare, Wicked Spoon at Cosmopolitan for variety, and Mon Ami Gabi at Paris for people-watching. Reservations recommended for weekend brunch service."
      },
      {
        id: 10,
        title: "Local Entrepreneur Opens Third Coffee Shop in Green Valley",
        publication: "West Valley Shoutouts",
        status: "published",
        image_url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=80&h=80&fit=crop",
        created_at: "2026-02-16T13:10:00Z",
        scrapable: true,
        content: "Coffee entrepreneur Jessica Park has opened her third location of Daily Grind Coffee in Green Valley Ranch. The cozy cafe features locally roasted beans, fresh pastries from a nearby bakery, and a community-focused atmosphere. Park credits her success to building relationships with customers and supporting other local businesses."
      },
      {
        id: 11,
        title: "Vegas Dog Park Renovation Complete: New Features Unveiled",
        publication: "Save The Doggy",
        status: "approved",
        image_url: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=80&h=80&fit=crop",
        created_at: "2026-02-19T10:30:00Z",
        scrapable: true,
        content: "The newly renovated Sunset Park Dog Park reopened today with exciting upgrades. New features include separate areas for small and large dogs, agility equipment, shaded seating, and a water fountain station. The $2.3 million renovation was funded through a bond measure approved by voters last year."
      },
      {
        id: 12,
        title: "Celebrity Chef Opens Farm-to-Table Restaurant in Summerlin",
        publication: "Vegas Fork",
        status: "draft",
        image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop",
        created_at: "2026-02-22T09:20:00Z",
        scrapable: false,
        content: "Celebrity chef Michael Thompson has opened Harvest Kitchen in Downtown Summerlin, focusing on locally sourced ingredients and seasonal menus. The restaurant partners with Nevada farms and ranchers to create dishes that highlight regional flavors. The dining room features floor-to-ceiling windows overlooking Red Rock Canyon."
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
    console.log('Approved article:', articleId);
    loadMockArticles();
  };

  const handleReject = (articleId) => {
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
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
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

          {/* Search, Filters, and View Toggle */}
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
            
            {/* View Toggle */}
            <div style={{ display: 'flex', gap: '4px', background: 'rgba(31, 41, 55, 0.5)', borderRadius: '8px', padding: '4px', border: '1px solid rgba(75, 85, 99, 0.5)' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 16px',
                  background: viewMode === 'list' ? '#8b5cf6' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: '600'
                }}
              >
                📋 List
              </button>
              <button
                onClick={() => setViewMode('cards')}
                style={{
                  padding: '6px 16px',
                  background: viewMode === 'cards' ? '#8b5cf6' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: '600'
                }}
              >
                🎴 Cards
              </button>
            </div>
          </div>

          {/* Articles - List or Card View */}
          {filteredArticles.length === 0 ? (
            <div style={{
              background: 'rgba(17, 24, 39, 0.5)',
              borderRadius: '16px',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              textAlign: 'center', 
              padding: '64px', 
              color: '#6b7280'
            }}>
              {searchTerm ? `No articles matching "${searchTerm}"` : `No ${filter} articles`}
            </div>
          ) : viewMode === 'list' ? (
            // LIST VIEW
            <div style={{
              background: 'rgba(17, 24, 39, 0.5)',
              borderRadius: '16px',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    background: 'rgba(31, 41, 55, 0.7)', 
                    borderBottom: '1px solid rgba(75, 85, 99, 0.5)' 
                  }}>
                    <th style={{ padding: '16px 20px', textAlign: 'left', color: '#9ca3af', fontSize: '13px', fontWeight: '600', width: '60px' }}>
                      
                    </th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', color: '#9ca3af', fontSize: '13px', fontWeight: '600', width: '60px' }}>
                      
                    </th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', color: '#9ca3af', fontSize: '13px', fontWeight: '600' }}>
                      TITLE
                    </th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', color: '#9ca3af', fontSize: '13px', fontWeight: '600', width: '200px' }}>
                      PUBLICATION
                    </th>
                    <th style={{ padding: '16px 20px', textAlign: 'left', color: '#9ca3af', fontSize: '13px', fontWeight: '600', width: '140px' }}>
                      DATE
                    </th>
                    <th style={{ padding: '16px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px', fontWeight: '600', width: '180px' }}>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article, index) => (
                    <ArticleRow 
                      key={article.id} 
                      article={article}
                      index={index}
                      onClick={() => setSelectedArticle(article)}
                      onApprove={() => handleApprove(article.id)}
                      onReject={() => handleReject(article.id)}
                      showActions={filter === 'draft'}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // CARD VIEW
            <div style={{
              background: 'rgba(17, 24, 39, 0.5)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(75, 85, 99, 0.5)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {filteredArticles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article}
                    onClick={() => setSelectedArticle(article)}
                    onApprove={() => handleApprove(article.id)}
                    onReject={() => handleReject(article.id)}
                    showActions={filter === 'draft'}
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '16px', textAlign: 'right', color: '#9ca3af', fontSize: '14px' }}>
            {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
          </div>
        </div>
      </main>

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}
    </div>
  );
}

function StatCard({ icon, count, label, active, onClick }) {
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
        transform: active ? 'scale(1.05)' : 'none'
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

function ArticleRow({ article, index, onClick, onApprove, onReject, showActions }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const publicationColors = {
    'West Valley Shoutouts': '#8b5cf6',
    'Save The Doggy': '#ec4899',
    'Vegas Fork': '#f59e0b'
  };
  
  return (
    <tr 
      style={{
        background: index % 2 === 0 ? 'rgba(31, 41, 55, 0.3)' : 'transparent',
        borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
        transition: 'all 0.2s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <td style={{ padding: '12px 20px' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '8px', 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          {article.image_url ? (
            <img 
              src={article.image_url} 
              alt="" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
              📰
            </div>
          )}
        </div>
      </td>

      {/* Scrapable Indicator */}
      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '20px' }} title={article.scrapable ? 'Can be scraped' : 'Protected - cannot scrape'}>
          {article.scrapable ? '🟢' : '🔴'}
        </div>
      </td>

      {/* Title */}
      <td style={{ padding: '12px 20px' }}>
        <div 
          onClick={onClick}
          style={{ 
            color: isHovered ? '#60a5fa' : '#fff', 
            fontSize: '14px', 
            fontWeight: '500', 
            lineHeight: 1.4,
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
        >
          {article.title}
        </div>
      </td>

      {/* Publication */}
      <td style={{ padding: '12px 20px' }}>
        <div style={{ 
          display: 'inline-block',
          padding: '6px 12px', 
          background: publicationColors[article.publication] || '#6b7280',
          borderRadius: '6px', 
          fontSize: '12px',
          color: '#fff',
          fontWeight: '600'
        }}>
          {article.publication === 'West Valley Shoutouts' && '📍 '}
          {article.publication === 'Save The Doggy' && '🐕 '}
          {article.publication === 'Vegas Fork' && '🍴 '}
          {article.publication}
        </div>
      </td>

      {/* Date */}
      <td style={{ padding: '12px 20px', color: '#9ca3af', fontSize: '13px' }}>
        {new Date(article.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })}
      </td>

      {/* Actions */}
      <td style={{ padding: '12px 20px', textAlign: 'center' }}>
        {showActions && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}>
            <button
              onClick={onApprove}
              style={{
                padding: '6px 16px',
                background: '#10b981',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '12px',
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
                padding: '6px 16px',
                background: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ✕ Reject
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

function ArticleCard({ article, onClick, onApprove, onReject, showActions }) {
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
      <div 
        onClick={onClick}
        style={{ 
          aspectRatio: '4/5', 
          background: article.image_url ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
          transition: 'filter 0.3s ease',
          cursor: 'pointer'
        }}
      >
        {article.image_url ? (
          <img 
            src={article.image_url.replace('w=80&h=80', 'w=400&h=500')} 
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
        
        {/* Scrapable Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }} title={article.scrapable ? 'Can be scraped' : 'Protected - cannot scrape'}>
          {article.scrapable ? '🟢' : '🔴'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 
          onClick={onClick}
          style={{ 
            color: isHovered ? '#60a5fa' : '#fff', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px', 
            lineHeight: 1.4,
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
        >
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

function ArticleModal({ article, onClose }) {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: '#1f2937',
          borderRadius: '16px',
          border: '1px solid rgba(75, 85, 99, 0.5)',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#fff',
              marginBottom: '12px',
              lineHeight: 1.3
            }}>
              {article.title}
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ 
                padding: '6px 12px', 
                background: '#8b5cf6',
                borderRadius: '6px', 
                fontSize: '12px',
                color: '#fff',
                fontWeight: '600'
              }}>
                {article.publication}
              </span>
              <span style={{ 
                padding: '6px 12px', 
                background: 'rgba(31, 41, 55, 0.7)',
                borderRadius: '6px', 
                fontSize: '12px',
                color: '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {article.scrapable ? '??' : '??'}
                {article.scrapable ? 'Scrapable' : 'Protected'}
              </span>
              <span style={{ 
                fontSize: '13px',
                color: '#9ca3af'
              }}>
                {new Date(article.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(31, 41, 55, 0.7)',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: '20px',
              lineHeight: 1,
              transition: 'all 0.2s'
            }}
          >
            ?
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 180px)'
        }}>
          {article.image_url && (
            <div style={{
              marginBottom: '24px',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <img 
                src={article.image_url.replace('w=80&h=80', 'w=800&h=400')} 
                alt={article.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
          )}
          
          <div style={{
            fontSize: '16px',
            lineHeight: 1.7,
            color: '#e5e7eb'
          }}>
            {article.content}
          </div>
        </div>
      </div>
    </div>
  );
}
