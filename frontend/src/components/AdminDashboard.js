import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate('/admin/login');
      return;
    }
    fetchUsers();
    // Optionally, set up polling or WebSocket for real-time updates
    // For simplicity, we'll use polling every 30 seconds
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [auth, navigate]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Unauthorized. Please log in.');
      setAuth(false);
      navigate('/admin/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to fetch user submissions');
      if (err.response?.status === 401) {
        // Token invalid or expired
        localStorage.removeItem('token');
        setAuth(false);
        navigate('/admin/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/admin/login');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
      {message && <div className="alert alert-danger">{message}</div>}
      {users.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        users.map(user => (
          <div key={user._id} className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{user.name}</h5>
              <h6 className="card-subtitle mb-3 text-muted">@{user.socialHandle}</h6>
              <div className="row">
                {user.images.map((img, index) => (
                  <div key={index} className="col-md-3 mb-3">
                    <a href={`http://localhost:5000/${img}`} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={`http://localhost:5000/${img}`} 
                        alt={`User upload ${index}`} 
                        className="img-fluid img-thumbnail"
                      />
                    </a>
                  </div>
                ))}
              </div>
              <p className="card-text"><small className="text-muted">Submitted on {new Date(user.submittedAt).toLocaleString()}</small></p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
