import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  withCredentials: true, // Important for session-based authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;