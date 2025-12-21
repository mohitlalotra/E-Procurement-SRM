const API_BASE = 'http://localhost:5000/api';

// Helper function for API calls
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    method,
    headers,
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
};

// Auth API
export const login = (email, password) => apiRequest('/auth/login', 'POST', { email, password });
export const register = (userData) => apiRequest('/auth/register', 'POST', userData);
export const getProfile = () => apiRequest('/auth/profile');

// Suppliers API
export const fetchSuppliers = () => apiRequest('/suppliers');
export const createSupplier = (supplier) => apiRequest('/suppliers', 'POST', supplier);
export const updateSupplier = (id, supplier) => apiRequest(`/suppliers/${id}`, 'PUT', supplier);
export const deleteSupplier = (id) => apiRequest(`/suppliers/${id}`, 'DELETE');

// Procurements API
export const fetchProcurements = () => apiRequest('/procurements');
export const createProcurement = (procurement) => apiRequest('/procurements', 'POST', procurement);
export const updateProcurement = (id, procurement) => apiRequest(`/procurements/${id}`, 'PUT', procurement);
export const deleteProcurement = (id) => apiRequest(`/procurements/${id}`, 'DELETE');

// Knowledge API
export const fetchKnowledge = () => apiRequest('/knowledge');
export const createKnowledge = (article) => apiRequest('/knowledge', 'POST', article);
export const updateKnowledge = (id, article) => apiRequest(`/knowledge/${id}`, 'PUT', article);
export const deleteKnowledge = (id) => apiRequest(`/knowledge/${id}`, 'DELETE');
export const rateHelpful = (id) => apiRequest(`/knowledge/${id}/helpful`, 'POST');