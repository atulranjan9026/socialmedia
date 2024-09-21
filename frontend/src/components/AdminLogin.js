import React, { useState, useContext } from 'react';
import api from '../api'; // Your axios instance
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/admin/login', credentials);
            setAuth(true);
            setMessage(res.data.message);
            navigate('/admin/dashboard');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Admin Login</h2>
            {message && <div className="alert alert-info">{message}</div>}
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
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-4">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
