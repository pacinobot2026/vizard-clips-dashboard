import { useState, useEffect } from 'react';
import Head from 'next/head';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Vault() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Sales Pages',
    type: 'Image',
    url: '',
    notes: '',
    tags: ''
  });

  const categories = [
    'Sales Pages',
    'Guides',
    'Emails',
    'Product Templates',
    'Landing Pages',
    'VSL Scripts',
    'Social Media',
    'Course Content',
    'Ad Copy',
    'Webinar Slides'
  ];

  const types = [
    'Image',
    'File',
    'Screenshot',
    'PPT',
    'URL',
    'Video',
    'Text',
    'Design Link'
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/vault/items');
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/vault/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...uploadForm,
          tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t)
        })
      });

      if (res.ok) {
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          category: 'Sales Pages',
          type: 'Image',
          url: '',
          notes: '',
          tags: ''
        });
        fetchItems();
      }
    } catch (err) {
      console.error('Error uploading:', err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesType && matchesSearch;
  });

  const getStatCount = (category) => {
    return items.filter(item => item.category === category).length;
  };

  const totalItems = items.length;

  return (
    <div style={{ minHeight: '100vh', background: '#0D1423' }}>
      <Head>
        <title>Operator Vault | Training Library</title>
      </Head>

      <div style={{ display: 'flex' }}>
        <NavigationSidebar />

        <div style={{ flex: 1, background: '#0D1423' }}>
          <div style={{ padding: '32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>🔐 Operator Vault</h1>
                  <p style={{ color: '#9ca3af' }}>Training library for sales pages, guides, templates & more</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    padding: '12px 24px',
                    background: '#eab308',
                    color: '#000',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#fbbf24'}
                  onMouseLeave={(e) => e.target.style.background = '#eab308'}
                >
                  + Add Resource
                </button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>{totalItems}</div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>Total</div>
              </div>
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#eab308', marginBottom: '4px' }}>{getStatCount('Sales Pages')}</div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>Sales</div>
              </div>
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>{getStatCount('Guides')}</div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>Guides</div>
              </div>
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22c55e', marginBottom: '4px' }}>{getStatCount('Emails')}</div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>Emails</div>
              </div>
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#a855f7', marginBottom: '4px' }}>{getStatCount('Product Templates')}</div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>Templates</div>
              </div>
            </div>

            {/* Filters */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Category Filter */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    padding: '8px 16px',
                    background: selectedCategory === 'all' ? '#eab308' : '#111827',
                    color: selectedCategory === 'all' ? '#000' : '#9ca3af',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      background: selectedCategory === cat ? '#eab308' : '#111827',
                      color: selectedCategory === cat ? '#000' : '#9ca3af',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    {cat} ({getStatCount(cat)})
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  onClick={() => setSelectedType('all')}
                  style={{
                    padding: '6px 12px',
                    background: selectedType === 'all' ? '#2563eb' : '#111827',
                    color: selectedType === 'all' ? '#fff' : '#6b7280',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  All Types
                </button>
                {types.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    style={{
                      padding: '6px 12px',
                      background: selectedType === type ? '#2563eb' : '#111827',
                      color: selectedType === type ? '#fff' : '#6b7280',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="group bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-yellow-500 transition cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="aspect-[4/5] bg-gray-800 flex items-center justify-center grayscale group-hover:grayscale-0 transition">
                    {item.type === 'Image' || item.type === 'Screenshot' ? (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    ) : item.type === 'Video' ? (
                      <div className="text-4xl md:text-6xl">🎥</div>
                    ) : item.type === 'PPT' ? (
                      <div className="text-4xl md:text-6xl">📊</div>
                    ) : item.type === 'File' ? (
                      <div className="text-4xl md:text-6xl">📄</div>
                    ) : item.type === 'URL' ? (
                      <div className="text-4xl md:text-6xl">🔗</div>
                    ) : (
                      <div className="text-4xl md:text-6xl">📝</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2 md:p-4">
                    <div className="flex items-start justify-between mb-1 md:mb-2">
                      <h3 className="text-white font-medium text-xs md:text-sm line-clamp-2">{item.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-800 text-gray-300 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-900 text-blue-300 rounded">
                        {item.type}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2 mb-1 md:mb-2">{item.notes}</p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 bg-yellow-900 text-yellow-300 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <p style={{ color: '#9ca3af', fontSize: '18px' }}>No resources found. Add your first one!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '32px', maxWidth: '672px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '24px' }}>Add Resource</h2>
            
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Title *</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Category *</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Type *</label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>URL / File Path *</label>
                <input
                  type="text"
                  required
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({...uploadForm, url: e.target.value})}
                  placeholder="https://... or /training/filename.png"
                  style={{ width: '100%', padding: '10px 12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Notes (Why this works)</label>
                <textarea
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({...uploadForm, notes: e.target.value})}
                  rows={3}
                  placeholder="What makes this example effective? Key elements to notice..."
                  style={{ width: '100%', padding: '10px 12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  placeholder="high-converting, template, swipe-file"
                  style={{ width: '100%', padding: '10px 12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#eab308',
                    color: '#000',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Add Resource
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#1f2937',
                    color: '#9ca3af',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
