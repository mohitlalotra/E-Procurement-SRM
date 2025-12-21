import React, { useState, useEffect } from 'react';
import { fetchProcurements, createProcurement, updateProcurement, deleteProcurement, fetchSuppliers } from './api';
import { toast } from 'react-hot-toast';

function Procurements() {
  const [procurements, setProcurements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProcurement, setEditingProcurement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'goods',
    budget: '',
    deadline: '',
    supplier: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [procData, supData] = await Promise.all([
        fetchProcurements(),
        fetchSuppliers()
      ]);
      setProcurements(procData);
      setSuppliers(supData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSend = {
        ...formData,
        budget: parseFloat(formData.budget)
      };
      
      if (editingProcurement) {
        await updateProcurement(editingProcurement._id, dataToSend);
        toast.success('Procurement updated successfully');
      } else {
        await createProcurement(dataToSend);
        toast.success('Procurement created successfully');
      }
      
      setShowForm(false);
      setEditingProcurement(null);
      setFormData({
        title: '', description: '', category: 'goods', budget: '', 
        deadline: '', supplier: '', status: 'draft'
      });
      loadData();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (procurement) => {
    setEditingProcurement(procurement);
    setFormData({
      title: procurement.title,
      description: procurement.description,
      category: procurement.category,
      budget: procurement.budget,
      deadline: procurement.deadline ? new Date(procurement.deadline).toISOString().split('T')[0] : '',
      supplier: procurement.supplier?._id || '',
      status: procurement.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this procurement?')) {
      try {
        await deleteProcurement(id);
        toast.success('Procurement deleted successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to delete procurement');
      }
    }
  };

  if (loading) return <div>Loading procurements...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Procurement Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingProcurement(null);
            setFormData({
              title: '', description: '', category: 'goods', budget: '', 
              deadline: '', supplier: '', status: 'draft'
            });
          }}
        >
          + Create Procurement
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingProcurement ? 'Edit Procurement' : 'Create New Procurement'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="goods">Goods</option>
                  <option value="services">Services</option>
                  <option value="works">Works</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Budget ($)</label>
                <input
                  type="number"
                  name="budget"
                  className="form-control"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  className="form-control"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Supplier</label>
                <select
                  name="supplier"
                  className="form-control"
                  value={formData.supplier}
                  onChange={handleInputChange}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">
                {editingProcurement ? 'Update' : 'Create'}
              </button>
              <button 
                type="button" 
                className="btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingProcurement(null);
                }}
                style={{ background: '#e2e8f0' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Procurement List ({procurements.length})</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Budget</th>
              <th>Deadline</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {procurements.map(procurement => (
              <tr key={procurement._id}>
                <td>{procurement.title}</td>
                <td>${procurement.budget?.toLocaleString()}</td>
                <td>{procurement.deadline ? new Date(procurement.deadline).toLocaleDateString() : '-'}</td>
                <td>{procurement.supplier?.name || '-'}</td>
                <td>
                  <span style={{
                    padding: '5px 10px',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    background: 
                      procurement.status === 'completed' ? '#c6f6d5' :
                      procurement.status === 'published' ? '#bee3f8' :
                      procurement.status === 'in_progress' ? '#fed7d7' :
                      '#e2e8f0',
                    color: 
                      procurement.status === 'completed' ? '#22543d' :
                      procurement.status === 'published' ? '#2c5282' :
                      procurement.status === 'in_progress' ? '#742a2a' :
                      '#4a5568'
                  }}>
                    {procurement.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      className="btn"
                      onClick={() => handleEdit(procurement)}
                      style={{ padding: '5px 10px', fontSize: '0.9em' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(procurement._id)}
                      style={{ padding: '5px 10px', fontSize: '0.9em' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Procurements;