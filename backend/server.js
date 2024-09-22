const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = ['https://socialmedia-f.onrender.com'];

app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// Import connectDB
const connectDB = require('./connectDB');

// Connect to MongoDB
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Initialize Admin User (Run once)
const Admin = require('./models/Admin');
const initializeAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
        if (!adminExists) {
            const admin = new Admin({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD
            });
            await admin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error initializing admin user:', err);
    }
};
initializeAdmin();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
