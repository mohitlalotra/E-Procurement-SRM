import React, { useState, useEffect } from 'react';
import { fetchKnowledge, createKnowledge, updateKnowledge, deleteKnowledge, rateHelpful } from './api';
import { toast } from 'react-hot-toast';

function Knowledge() {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'guide',
    tags: ''
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await fetchKnowledge();
      setArticles(data);
    } catch (error) {
      toast.error('Failed to load knowledge articles');
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
      const dataToSend = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      if (editingArticle) {
        await updateKnowledge(editingArticle._id, dataToSend);
        toast.success('Article updated successfully');
      } else {
        await createKnowledge(dataToSend);
        toast.success('Article created successfully');
      }
      
      setShowForm(false);
      setEditingArticle(null);
      setFormData({ title: '', content: '', category: 'guide', tags: '' });
      loadArticles();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      tags: article.tags.join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteKnowledge(id);
        toast.success('Article deleted successfully');
        loadArticles();
      } catch (error) {
        toast.error('Failed to delete article');
      }
    }
  };

  const handleHelpful = async (id) => {
    try {
      await rateHelpful(id);
      toast.success('Thank you for your feedback!');
      loadArticles();
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div>Loading knowledge base...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Knowledge Base</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingArticle(null);
            setFormData({ title: '', content: '', category: 'guide', tags: '' });
          }}
        >
          + Add Article
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search articles by title, content, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingArticle ? 'Edit Article' : 'Add New Article'}</h3>
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
              <label>Category</label>
              <select
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="guide">Guide</option>
                <option value="process">Process</option>
                <option value="policy">Policy</option>
                <option value="faq">FAQ</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                className="form-control"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., procurement, supplier, contract"
              />
            </div>
            
            <div className="form-group">
              <label>Content *</label>
              <textarea
                name="content"
                className="form-control"
                value={formData.content}
                onChange={handleInputChange}
                rows="10"
                required
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">
                {editingArticle ? 'Update' : 'Create'}
              </button>
              <button 
                type="button" 
                className="btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingArticle(null);
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
        <h3>Knowledge Articles ({filteredArticles.length})</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button 
            className="btn"
            onClick={() => setSearchTerm('')}
            style={{ background: '#e2e8f0' }}
          >
            All
          </button>
          <button 
            className="btn"
            onClick={() => setSearchTerm('guide')}
            style={{ background: '#e2e8f0' }}
          >
            Guides
          </button>
          <button 
            className="btn"
            onClick={() => setSearchTerm('process')}
            style={{ background: '#e2e8f0' }}
          >
            Processes
          </button>
          <button 
            className="btn"
            onClick={() => setSearchTerm('policy')}
            style={{ background: '#e2e8f0' }}
          >
            Policies
          </button>
        </div>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredArticles.map(article => (
            <div key={article._id} className="card" style={{ padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <h4 style={{ margin: 0 }}>{article.title}</h4>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: '#e2e8f0',
                  fontSize: '0.8em',
                  textTransform: 'uppercase'
                }}>
                  {article.category}
                </span>
              </div>
              
              <p style={{ color: '#666', marginBottom: '10px' }}>
                {article.content.substring(0, 200)}...
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {article.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '2px 6px',
                      marginRight: '5px',
                      background: '#bee3f8',
                      borderRadius: '3px',
                      fontSize: '0.8em'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    👁️ {article.views}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    👍 {article.helpful}
                    <button 
                      onClick={() => handleHelpful(article._id)}
                      style={{
                        background: 'none',
                        border: '1px solid #ddd',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      +1
                    </button>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}>
                <button 
                  className="btn"
                  onClick={() => handleEdit(article)}
                  style={{ padding: '5px 10px', fontSize: '0.9em' }}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(article._id)}
                  style={{ padding: '5px 10px', fontSize: '0.9em' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Knowledge;