import { useState, useEffect } from 'react';
import Head from 'next/head';
import NavigationSidebar from '../components/NavigationSidebar';

export default function Dashboard() {
  const [data, setData] = useState({
    sales: null,
    ads: null,
    systems: null,
    support: null,
    projects: null,
    products: null,
    loading: true
  });

  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchAllData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const [sales, ads, systems, support, projects, products] = await Promise.all([
        fetch('/api/sales').then(r => r.json()).catch(() => ({ mtd: 0, yesterday: 0, today: 0 })),
        fetch('/api/ads').then(r => r.json()).catch(() => ({ mtdSpend: 0, mtdSales: 0 })),
        fetch('/api/systems').then(r => r.json()).catch(() => ({ online: 0, total: 0 })),
        fetch('/api/support').then(r => r.json()).catch(() => ({ open: 0, urgent: 0 })),
        fetch('/api/projects').then(r => r.json()).catch(() => ({ active: [] })),
        fetch('/api/products').then(r => r.json()).catch(() => ({ products: [] }))
      ]);

      setData({
        sales,
        ads,
        systems,
        support,
        projects,
        products,
        loading: false
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setData({
        sales: { mtd: 0, yesterday: 0, today: 0 },
        ads: { mtdSpend: 0, mtdSales: 0 },
        systems: { online: 0, total: 0 },
        support: { open: 0, urgent: 0 },
        projects: { active: [] },
        products: { products: [] },
        loading: false
      });
    }
  };

  if (data.loading) {
    return (
      <div className="flex min-h-screen">
        <Head>
          <title>Business Intelligence | Chad Nicely</title>
        </Head>
        <NavigationSidebar />
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading business intelligence...</p>
          </div>
          <style jsx>{styles}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Head>
        <title>Business Intelligence | Chad Nicely</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <NavigationSidebar />
      
      <div className="container">

      {/* Header */}
      <header className="header">
        <h1>🎯 Business Command Center</h1>
        <div className="header-meta">
          <span className="timestamp">
            Last updated: {lastUpdated?.toLocaleTimeString()}
          </span>
          <button onClick={fetchAllData} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
      </header>

      {/* Quick Stats Row */}
      <div className="quick-stats">
        <StatCard
          label="MTD Revenue"
          value={`$${data.sales?.mtd?.toLocaleString() || '0'}`}
          trend={data.sales?.trend}
          color="#10b981"
        />
        <StatCard
          label="Yesterday"
          value={`$${data.sales?.yesterday?.toLocaleString() || '0'}`}
          subtitle={`${data.sales?.yesterdayOrders || 0} orders`}
          color="#3b82f6"
        />
        <StatCard
          label="Open Tickets"
          value={data.support?.open || '0'}
          subtitle={`${data.support?.urgent || 0} urgent`}
          color={data.support?.urgent > 5 ? '#ef4444' : '#f59e0b'}
        />
        <StatCard
          label="Systems Health"
          value={data.systems?.online || '0'}
          subtitle={`${data.systems?.total || 0} total`}
          color={data.systems?.allOnline ? '#10b981' : '#ef4444'}
        />
      </div>

      {/* Main Grid */}
      <div className="grid">
        {/* Sales & Revenue */}
        <section className="card">
          <h2>💰 Sales & Revenue</h2>
          <div className="card-content">
            <div className="metric-row">
              <span>MTD Revenue:</span>
              <strong>${data.sales?.mtd?.toLocaleString()}</strong>
            </div>
            <div className="metric-row">
              <span>MTD Orders:</span>
              <strong>{data.sales?.mtdOrders}</strong>
            </div>
            <div className="metric-row">
              <span>Yesterday:</span>
              <strong>${data.sales?.yesterday?.toLocaleString()} ({data.sales?.yesterdayOrders} orders)</strong>
            </div>
            <div className="metric-row">
              <span>Today:</span>
              <strong>${data.sales?.today?.toLocaleString()} ({data.sales?.todayOrders} orders)</strong>
            </div>
            <div className="metric-row">
              <span>Avg Order Value:</span>
              <strong>${data.sales?.avgOrderValue?.toFixed(2)}</strong>
            </div>
          </div>
        </section>

        {/* Ad Performance */}
        <section className="card">
          <h2>📊 Ad Performance (LNH)</h2>
          <div className="card-content">
            <div className="metric-row">
              <span>MTD Spend:</span>
              <strong className="negative">${data.ads?.mtdSpend?.toLocaleString()}</strong>
            </div>
            <div className="metric-row">
              <span>MTD Sales:</span>
              <strong>${data.ads?.mtdSales?.toLocaleString()}</strong>
            </div>
            <div className="metric-row">
              <span>ROAS:</span>
              <strong className={data.ads?.mtdRoas >= 1 ? 'positive' : 'negative'}>
                {data.ads?.mtdRoas?.toFixed(2)}x
              </strong>
            </div>
            <div className="metric-row">
              <span>MTD Profit:</span>
              <strong className={data.ads?.mtdProfit >= 0 ? 'positive' : 'negative'}>
                ${data.ads?.mtdProfit?.toLocaleString()}
              </strong>
            </div>
            <div className="metric-row">
              <span>CAC:</span>
              <strong>${data.ads?.mtdCac?.toFixed(2)}</strong>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="card">
          <h2>🚀 Active Products</h2>
          <div className="card-content">
            {data.products?.active?.map((product, i) => (
              <div key={i} className="product-item">
                <div>
                  <strong>{product.name}</strong>
                  <span className="product-price">${product.price}</span>
                </div>
                <a href={product.url} target="_blank" rel="noopener" className="link-btn">
                  View →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="card">
          <h2>📋 Active Projects</h2>
          <div className="card-content">
            {data.projects?.active?.length > 0 ? (
              data.projects.active.map((project, i) => (
                <div key={i} className="project-item">
                  <div className="project-header">
                    <strong>{project.name}</strong>
                    <span className={`status status-${project.status}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="project-desc">{project.description}</p>
                </div>
              ))
            ) : (
              <p className="empty-state">No active projects</p>
            )}
          </div>
        </section>

        {/* Systems Health */}
        <section className="card">
          <h2>🏥 Systems Health</h2>
          <div className="card-content">
            <h3>APIs</h3>
            {data.systems?.apis?.map((api, i) => (
              <div key={i} className="system-row">
                <span>{api.name}</span>
                <span className={`status-dot ${api.status}`}></span>
              </div>
            ))}
            <h3 style={{ marginTop: '1rem' }}>URLs</h3>
            {data.systems?.urls?.map((url, i) => (
              <div key={i} className="system-row">
                <span className="url-text">{url.name}</span>
                <span className={`status-dot ${url.status}`}></span>
              </div>
            ))}
          </div>
        </section>

        {/* Support */}
        <section className="card">
          <h2>🎫 Support & Operations</h2>
          <div className="card-content">
            <div className="metric-row">
              <span>Open Tickets:</span>
              <strong>{data.support?.open}</strong>
            </div>
            <div className="metric-row">
              <span>Urgent:</span>
              <strong className={data.support?.urgent > 0 ? 'negative' : ''}>
                {data.support?.urgent}
              </strong>
            </div>
            <div className="metric-row">
              <span>DFY Phase 1:</span>
              <strong>{data.support?.dfyPhase1} pending</strong>
            </div>
            <div className="metric-row">
              <span>DFY Phase 2:</span>
              <strong>{data.support?.dfyPhase2} pending</strong>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="card">
          <h2>⚡ Quick Actions</h2>
          <div className="card-content">
            <button className="action-btn">📦 /create business</button>
            <button className="action-btn">📧 /emailstats</button>
            <button className="action-btn">🔗 /poplink</button>
            <button className="action-btn">📝 /article</button>
            <button className="action-btn">📺 /replay</button>
            <button className="action-btn">🚀 /broadcast</button>
          </div>
        </section>

        {/* Team Tasks */}
        <section className="card">
          <h2>👥 Team Follow-ups</h2>
          <div className="card-content">
            {data.projects?.teamTasks?.length > 0 ? (
              data.projects.teamTasks.map((task, i) => (
                <div key={i} className="task-item">
                  <span className={`priority priority-${task.priority}`}>
                    {task.priority}
                  </span>
                  <span>{task.task}</span>
                </div>
              ))
            ) : (
              <p className="empty-state">No pending team tasks</p>
            )}
          </div>
        </section>
      </div>

      <style jsx>{styles}</style>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtitle, trend, color }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <div className="stat-value" style={{ color }}>{value}</div>
      {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      {trend && <span className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </span>}
    </div>
  );
}

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0f172a;
    color: #e2e8f0;
    line-height: 1.6;
  }

  .container {
    flex: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    padding-top: 4rem;
  }
  
  @media (min-width: 768px) {
    .container {
      padding-top: 2rem;
    }
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 1rem;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #334155;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #1e293b;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .timestamp {
    color: #64748b;
    font-size: 0.875rem;
  }

  .refresh-btn {
    background: #1e293b;
    color: #e2e8f0;
    border: 1px solid #334155;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .refresh-btn:hover {
    background: #334155;
    border-color: #475569;
  }

  .quick-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-label {
    color: #94a3b8;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
  }

  .stat-subtitle {
    color: #64748b;
    font-size: 0.875rem;
  }

  .stat-trend {
    font-size: 0.875rem;
    font-weight: 600;
  }

  .stat-trend.positive { color: #10b981; }
  .stat-trend.negative { color: #ef4444; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .card h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #f1f5f9;
  }

  .card h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 1rem;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #334155;
  }

  .metric-row:last-child {
    border-bottom: none;
  }

  .metric-row span {
    color: #94a3b8;
  }

  .metric-row strong {
    color: #e2e8f0;
    font-weight: 600;
  }

  .positive { color: #10b981 !important; }
  .negative { color: #ef4444 !important; }

  .product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #0f172a;
    border-radius: 8px;
    border: 1px solid #334155;
  }

  .product-price {
    color: #10b981;
    font-weight: 600;
    margin-left: 0.5rem;
  }

  .link-btn {
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;
  }

  .link-btn:hover {
    color: #60a5fa;
  }

  .project-item {
    padding: 0.75rem;
    background: #0f172a;
    border-radius: 8px;
    border: 1px solid #334155;
  }

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .project-desc {
    color: #94a3b8;
    font-size: 0.875rem;
  }

  .status {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-high { background: #dc2626; color: white; }
  .status-in-progress { background: #f59e0b; color: white; }
  .status-waiting { background: #6366f1; color: white; }
  .status-done { background: #10b981; color: white; }

  .system-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }

  .url-text {
    font-size: 0.875rem;
    color: #94a3b8;
  }

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .status-dot.online { background: #10b981; }
  .status-dot.offline { background: #ef4444; }
  .status-dot.warning { background: #f59e0b; }

  .empty-state {
    color: #64748b;
    font-style: italic;
    text-align: center;
    padding: 1rem;
  }

  .action-btn {
    width: 100%;
    background: #0f172a;
    color: #e2e8f0;
    border: 1px solid #334155;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
    text-align: left;
  }

  .action-btn:hover {
    background: #334155;
    border-color: #475569;
  }

  .task-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #0f172a;
    border-radius: 8px;
    border: 1px solid #334155;
  }

  .priority {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .priority-high { background: #dc2626; color: white; }
  .priority-med { background: #f59e0b; color: white; }
  .priority-low { background: #64748b; color: white; }

  @media (max-width: 768px) {
    .container { padding: 1rem; }
    h1 { font-size: 1.5rem; }
    .grid { grid-template-columns: 1fr; }
    .quick-stats { grid-template-columns: 1fr; }
  }
`;

