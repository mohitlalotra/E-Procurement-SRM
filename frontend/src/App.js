import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Dashboard from './dashboard';
import Suppliers from './suppliers';
import Procurements from './procurements';
import Knowledge from './knowledge';
import { getProfile } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await getProfile();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
    toast.success('Login successful!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="App">
        {isAuthenticated && (
          <nav className="navbar">
            <h1>📦 SRM Procurement System</h1>
            <div className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/suppliers">Suppliers</Link>
              <Link to="/procurements">Procurements</Link>
              <Link to="/knowledge">Knowledge Base</Link>
              <span style={{ color: 'white', margin: '0 10px' }}>
                Welcome, {user?.name}
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid white',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </nav>
        )}
        
        <div className="container">
          <Routes>
            <Route path="/" element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <LoginPage onLogin={handleLogin} />
            } />
            <Route path="/dashboard" element={
              isAuthenticated ? 
              <Dashboard /> : 
              <Navigate to="/" />
            } />
            <Route path="/suppliers" element={
              isAuthenticated ? 
              <Suppliers /> : 
              <Navigate to="/" />
            } />
            <Route path="/procurements" element={
              isAuthenticated ? 
              <Procurements /> : 
              <Navigate to="/" />
            } />
            <Route path="/knowledge" element={
              isAuthenticated ? 
              <Knowledge /> : 
              <Navigate to="/" />
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
     const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const response = await fetch(
  `${API_URL}/api/auth/${isRegistering ? 'register' : 'login'}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      isRegistering ? { email, password, name, company } : { email, password }
    ),
  }
);
      
      const data = await response.json();
      
      if (response.ok) {
        onLogin(data.token, data.user);
      } else {
        toast.error(data.error || 'Authentication failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                className="form-control"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Login')}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            marginLeft: '5px'
          }}
        >
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}

export default App;
