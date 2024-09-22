import React, { useState, useContext } from 'react';
import api from '../api'; // Corrected import path based on `api.js` export
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
        try {
            const res = await api.post('/api/admin/login', credentials);
            const { token, message } = res.data;
            // Store token in localStorage
            localStorage.setItem('token', token);
            setAuth(true);
            setMessage(message || 'Login successful.');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            // Enhanced error logging
            if (err.response) {
                // Server responded with a status other than 2xx
                console.error('Error data:', err.response.data);
                console.error('Error status:', err.response.status);
                console.error('Error headers:', err.response.headers);
                setMessage(err.response.data.message || 'Login failed');
            } else if (err.request) {
                // Request was made but no response received
                console.error('No response received:', err.request);
                setMessage('No response from server');
            } else {
                // Something else happened
                console.error('Error setting up request:', err.message);
                setMessage('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="container mt-5">
            <h2>Admin Login</h2>
            {message && (
                <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-info'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
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
                        aria-required="true"
                        aria-label="Username"
                    />
                </div>
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
                        aria-required="true"
                        aria-label="Password"
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-4" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
