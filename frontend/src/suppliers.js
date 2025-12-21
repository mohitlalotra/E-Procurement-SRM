import React, { useState, useEffect } from 'react';
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from './api';
import { toast } from 'react-hot-toast';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'manufacturer',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (error) {
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier._id, formData);
        toast.success('Supplier updated successfully');
      } else {
        await createSupplier(formData);
        toast.success('Supplier created successfully');
      }
      
      setShowForm(false);
      setEditingSupplier(null);
      setFormData({ name: '', email: '', phone: '', category: 'manufacturer', address: '' });
      loadSuppliers();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      category: supplier.category,
      address: supplier.address
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplier(id);
        toast.success('Supplier deleted successfully');
        loadSuppliers();
      } catch (error) {
        toast.error('Failed to delete supplier');
      }
    }
  };

  if (loading) return <div>Loading suppliers...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Supplier Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingSupplier(null);
            setFormData({ name: '', email: '', phone: '', category: 'manufacturer', address: '' });
          }}
        >
          + Add Supplier
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Supplier Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="manufacturer">Manufacturer</option>
                <option value="distributor">Distributor</option>
                <option value="service">Service Provider</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">
                {editingSupplier ? 'Update' : 'Create'}
              </button>
              <button 
                type="button" 
                className="btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingSupplier(null);
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
        <h3>Supplier List ({suppliers.length})</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Category</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier._id}>
                <td>{supplier.name}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone || '-'}</td>
                <td>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: '#e2e8f0',
                    fontSize: '0.9em'
                  }}>
                    {supplier.category}
                  </span>
                </td>
                <td>
                  <div style={{
                    width: '100px',
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${supplier.performanceScore || 0}%`,
                      height: '100%',
                      background: supplier.performanceScore > 70 ? '#48bb78' : 
                                 supplier.performanceScore > 40 ? '#ed8936' : '#f56565'
                    }} />
                  </div>
                  <small>{supplier.performanceScore || 0}%</small>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      className="btn"
                      onClick={() => handleEdit(supplier)}
                      style={{ padding: '5px 10px', fontSize: '0.9em' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(supplier._id)}
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

export default Suppliers;