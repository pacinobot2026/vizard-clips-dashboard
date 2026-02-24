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
    <div style={{ minHeight: '100vh', background: '#030712' }}>
      <Head>
        <title>Operator Vault | Training Library</title>
      </Head>

      <div style={{ display: 'flex' }}>
        <NavigationSidebar />

        <div style={{ flex: 1, background: '#030712' }}>
          <div style={{ padding: '32px' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>🔐 Operator Vault</h1>
                  <p style={{ color: '#9ca3af' }}>Training library for sales pages, guides, templates & more</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    padding: '12px 24px',
                    background: '#eab308',
                    color: '#000',
                    fontWeight: 600,
                    borderRadius: '8px',
                    border: 'none',
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
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: selectedCategory === 'all' ? '#eab308' : '#111827',
                    color: selectedCategory === 'all' ? '#000' : '#9ca3af'
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
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      background: selectedCategory === cat ? '#eab308' : '#111827',
                      color: selectedCategory === cat ? '#000' : '#9ca3af'
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
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                    cursor: 'pointer',
                    background: selectedType === 'all' ? '#2563eb' : '#111827',
                    color: selectedType === 'all' ? '#fff' : '#6b7280'
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
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '12px',
                      cursor: 'pointer',
                      background: selectedType === type ? '#2563eb' : '#111827',
                      color: selectedType === type ? '#fff' : '#6b7280'
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
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 text-sm md:text-lg">No resources found. Add your first one!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Add Resource</h2>
            
            <form onSubmit={handleUpload} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  className="w-full px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Category *</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-yellow-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Type *</label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-yellow-500"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-1 md:mb-2">URL / File Path *</label>
                <input
                  type="text"
                  required
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({...uploadForm, url: e.target.value})}
                  placeholder="https://... or /training/filename.png"
                  className="w-full px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Notes (Why this works)</label>
                <textarea
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({...uploadForm, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-yellow-500"
                  placeholder="What makes this example effective? Key elements to notice..."
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  placeholder="high-converting, template, swipe-file"
                  className="w-full px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm md:text-base focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 transition text-sm md:text-base"
                >
                  Add Resource
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gray-800 text-gray-300 font-semibold rounded-lg hover:bg-gray-700 transition text-sm md:text-base"
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
