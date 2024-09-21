import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', credentials);
      localStorage.setItem('token', res.data.token);
      setAuth(true);
      navigate('/admin/dashboard'); // Redirect to dashboard upon successful login
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Login</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <form onSubmit={handleSubmit}>
        {/* Username Input */}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            className="form-control" 
            id="username" 
            name="username" 
            value={credentials.username} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Password Input */}
        <div className="form-group mt-3">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            name="password" 
            value={credentials.password} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary mt-4">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
