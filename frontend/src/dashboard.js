import React, { useState, useEffect } from 'react';
import { fetchSuppliers, fetchProcurements, fetchKnowledge } from './api';
import { toast } from 'react-hot-toast';

function Dashboard() {
  const [stats, setStats] = useState({
    suppliers: 0,
    procurements: 0,
    knowledge: 0,
    activeProcurements: 0
  });
  const [recentProcurements, setRecentProcurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [suppliers, procurements, knowledge] = await Promise.all([
        fetchSuppliers(),
        fetchProcurements(),
        fetchKnowledge()
      ]);

      const activeProcurements = procurements.filter(p => 
        p.status === 'draft' || p.status === 'published'
      ).length;

      setStats({
        suppliers: suppliers.length,
        procurements: procurements.length,
        knowledge: knowledge.length,
        activeProcurements
      });

      setRecentProcurements(procurements.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Dashboard Overview</h2>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Suppliers</h3>
          <p>{stats.suppliers}</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Total Procurements</h3>
          <p>{stats.procurements}</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Knowledge Articles</h3>
          <p>{stats.knowledge}</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Active Procurements</h3>
          <p>{stats.activeProcurements}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '15px' }}>Recent Procurements</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Budget</th>
              <th>Deadline</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentProcurements.map(procurement => (
              <tr key={procurement._id}>
                <td>{procurement.title}</td>
                <td>${procurement.budget?.toLocaleString()}</td>
                <td>{new Date(procurement.deadline).toLocaleDateString()}</td>
                <td>
                  <span style={{
                    padding: '5px 10px',
                    borderRadius: '4px',
                    background: procurement.status === 'completed' ? '#c6f6d5' : '#fed7d7',
                    color: procurement.status === 'completed' ? '#22543d' : '#742a2a'
                  }}>
                    {procurement.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
  <h3>Quick Actions</h3>
  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
    <button 
      className="btn btn-primary"
      onClick={() => window.location.href = '/suppliers'}
    >
      Add New Supplier
    </button>
    
    <button 
      className="btn btn-success"
      onClick={() => window.location.href = '/procurements'}
    >
      Create Procurement
    </button>
    
    <button 
      className="btn btn-primary"
      onClick={() => window.location.href = '/knowledge'}
    >
      Add Knowledge Article
    </button>
  </div>
  </div>
    </div>
  );
}

export default Dashboard;